package teamsocial.wordgame.model.game;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
/**
 * The Player of the game
 */
public class Player implements Serializable {
  private String name;
}
