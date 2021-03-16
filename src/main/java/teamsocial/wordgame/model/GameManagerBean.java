package teamsocial.wordgame.model;

import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.ApplicationScope;
import teamsocial.wordgame.model.game.Game;
import teamsocial.wordgame.repository.ICategoryRepository;
import teamsocial.wordgame.websocket.GameChangedPushService;

@ApplicationScope
@Component
public class GameManagerBean implements Game.GameFinishedListeners {

  private Map<String, Game> games;

  @Autowired
  private ICategoryRepository categoryRepository;

  @Autowired
  private GameChangedPushService pushService;

  @PostConstruct
  private void init() {
    games = new HashMap<>();
  }

  public Game getGameByPin(String pin) {
    var game = games.get(pin);
    return game;
  }

  public Game createGame(String categoryName) {
    var categoryOptional = categoryRepository.findById(categoryName);

    if (categoryOptional.isEmpty()) {
      throw new IllegalArgumentException("No category with the name " + categoryName);
    }

    var category = categoryOptional.get();
    if (category.getWords() == null || category.getWords().isEmpty()) {
      throw new IllegalStateException(
        "Cant create a game with a category that has no words" + category
      );
    }

    var pin = getUnusedPin();
    var game = new Game(category, pin);
    game.addGameChangedObserver(pushService);
    game.addGameFinishedListener(this);
    games.put(pin, game);
    return game;
  }

  public void removeGame(String pin) {
    games.remove(pin);
  }

  private String getUnusedPin() {
    String pin = null;

    while (pin == null || games.containsKey(pin)) {
      var pinInt = (int) ((Math.random() * (99999 - 10000)) + 10000);
      pin = String.valueOf(pinInt);
    }

    return pin;
  }

  @Override
  public void notifyGameFinished(String pin) {
    removeGame(pin);
  }
}
