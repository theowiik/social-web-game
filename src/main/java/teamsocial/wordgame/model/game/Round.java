package teamsocial.wordgame.model.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import teamsocial.wordgame.model.entity.Category;
import teamsocial.wordgame.model.entity.Word;

@Data
@NoArgsConstructor
public class Round implements Serializable {

  private Word word;
  private Map<Player, String> explanations;
  private State state;
  @Getter(onMethod = @__(@JsonIgnore))
  private RoundChanged roundChangedImpl;

  public Round(Category category, RoundChanged roundChangedImpl) {
    this.roundChangedImpl = roundChangedImpl;
    var rand = new java.util.Random();
    var words = category.getWords();
    word = words.get(rand.nextInt(words.size()));
    explanations = new HashMap<>();
  }

  /**
   * Sets the answer for the player.
   *
   * @param player      the player that wants to add the word.
   * @param description the description of the word.
   */
  public void setExplanation(Player player, String description) {
    if (player == null
        || !validDescription(description)
        || state != State.PRESENT_WORD_INPUT_EXPLANATION
    ) {
      throw new IllegalStateException();
    }
    explanations.put(player, description);
  }

  private boolean validDescription(String string) {

    // Has content
    if (string == null || string.isEmpty()) {
      return false;
    }

    // Valid length
    return string.length() > 1 && string.length() < 50;
  }

  public void start() {
    enterPresentWordInputExplanation();
  }

  private void enterPresentWordInputExplanation() {
    this.state = State.PRESENT_WORD_INPUT_EXPLANATION;
    roundChangedImpl.performOnRoundStateChanged();
    callAfter(this::enterEnterExplanation, state.getDurationSeconds());
  }

  private void enterEnterExplanation() {
    this.state = State.PRESENT_WORD_INPUT_EXPLANATION;
    roundChangedImpl.performOnRoundStateChanged();
    callAfter(this::enterSelectExplanation, state.getDurationSeconds());
  }

  private void enterSelectExplanation() {
    this.state = State.SELECT_EXPLANATION;
    roundChangedImpl.performOnRoundStateChanged();
    callAfter(this::enterPresentAnswer, state.getDurationSeconds());
  }

  private void enterPresentAnswer() {
    state = State.PRESENT_ANSWER;
    roundChangedImpl.performOnRoundStateChanged();
    callAfter(this::enterPresentScore, state.getDurationSeconds());
  }

  private void enterPresentScore() {
    state = State.PRESENT_SCORE;
    roundChangedImpl.performOnRoundStateChanged();
    System.out.println("round ended!");
  }

  /**
   * Runs the invokable method after {@code delayInSeconds} seconds.
   *
   * @param invokable      the method to invoke.
   * @param delayInSeconds the time in seconds to delay.
   */
  private void callAfter(Invokable invokable, int delayInSeconds) {
    ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(1);
    exec.schedule(invokable::perform, delayInSeconds, TimeUnit.SECONDS);
  }

  public enum State {
    PRESENT_WORD_INPUT_EXPLANATION(4),
    SELECT_EXPLANATION(4),
    PRESENT_ANSWER(4),
    PRESENT_SCORE(4);

    private final int durationSeconds;

    State(int durationSeconds) {
      this.durationSeconds = durationSeconds;
    }

    public int getDurationSeconds() {
      return durationSeconds;
    }
  }

  interface RoundChanged {

    void performOnRoundStateChanged();
  }

  private interface Invokable {

    void perform();
  }
}
