package teamsocial.wordgame.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import teamsocial.wordgame.model.entity.Word;
import teamsocial.wordgame.repository.IWordRepository;

@RestController
@RequestMapping("/api/v1/words")
public class WordController {

  @Autowired
  private IWordRepository wordRepository;

  @GetMapping
  public List<Word> index() {
    return wordRepository.findAll();
  }
}
