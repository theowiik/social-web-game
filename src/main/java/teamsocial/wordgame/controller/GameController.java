package teamsocial.wordgame.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.SessionScope;
import org.springframework.web.server.ResponseStatusException;
import teamsocial.wordgame.model.GameManagerBean;
import teamsocial.wordgame.model.UserBean;
import teamsocial.wordgame.model.game.Game;
import teamsocial.wordgame.model.game.Player;

import java.io.Serializable;

@RestController
@RequestMapping("/api/v1/games")
@SessionScope // TODO Can this be ApplicationScope?
public class GameController implements Serializable {

  @Autowired
  private GameManagerBean gameManager;

  @Autowired
  private UserBean userBean;

  @PostMapping("/")
  public Game create(@RequestParam("category") String category) {
    return gameManager.createGame(category);
  }

  @GetMapping("/{pin}")
  public ResponseEntity<Game> get(@PathVariable("pin") String pin) {
    var game = getGame(pin);
    return ResponseEntity.ok(game);
  }

  @PostMapping("/{pin}/add_explanation")
  public ResponseEntity addExplanation(
    @PathVariable("pin") String pin,
    @RequestParam("explanation") String explanation
  ) {
    try {
      var game = getGame(pin);
      game.addPlayerExplanation(userBean.getPlayer(), explanation);
      return ResponseEntity.ok().build();
    } catch (IllegalStateException e) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Could not add player explanation");
    }
  }

  @PostMapping("/{pin}/pick_explanation")
  public ResponseEntity pickExplanation(
    @PathVariable("pin") String pin,
    @RequestParam("explanation") String explanation
  ) {
    try {
      var game = getGame(pin);
      game.pickExplanation(userBean.getPlayer(), explanation);
      return ResponseEntity.ok().build();
    } catch (IllegalStateException e) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Could not pick explanation");
    }
  }

  @PostMapping("/{pin}/join")
  public ResponseEntity joinGame(
    @PathVariable("pin") String pin,
    @RequestParam("name") String name
  ) {
    var game = getGame(pin);

    if (userBean.getPlayer() == null) {
      userBean.setPlayer(new Player(name));
    }

    if (!game.playerIsJoined(userBean.getPlayer())) {
      game.addPlayer(userBean.getPlayer());
    }

    game.notifyGameChangedObservers();

    return ResponseEntity.ok().build();
  }

  @PostMapping("/{pin}/start")
  public ResponseEntity startGame(@PathVariable("pin") String pin) {
    var game = getGame(pin);

    if (game.isStarted()) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Game already started");
    }

    game.startGame();

    return ResponseEntity.ok().build();
  }

  private Game getGame(String pin) {
    var game = gameManager.getGameByPin(pin);

    if (game == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find game");
    }

    return game;
  }

}
