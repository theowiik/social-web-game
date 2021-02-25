package teamsocial.socialgame.model.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import lombok.Data;

@Data
public class Round implements Serializable {

  private Word word;
  private List<Answer> answers;

  public Round(Category category) {
    // TODO: What if no words in category?
    Objects.requireNonNull(category);

    Random rand = new java.util.Random();
    List<Word> words = category.getWords();
    word = words.get(rand.nextInt(words.size()));
    answers = new ArrayList<Answer>();
  }

  public void setAnswer(Player player, String description) {
    Answer answer = new Answer(player, description);
    answers.add(answer); // TODO: Check if player already exists.
  }
}
