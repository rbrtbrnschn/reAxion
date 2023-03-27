import { v4 as uuid } from 'uuid';
import { easyDifficulty, SettingsManager, StandardDifficulty } from '..';
import {
  GameManager,
  GameManagerMediator,
  GameService,
  Reaction,
} from '../../game-manager';
import { Game } from '../../game-manager/game/game';

describe('EasyDifficultyStrategy', () => {
  let game: Game;
  let difficultyStrategy: StandardDifficulty;
  let gameManager: GameManager;
  let reaction: Reaction;
  const reactionDuration = 1000;

  beforeEach(() => {
    const mediator = new GameManagerMediator(new SettingsManager());
    gameManager = new GameManager(mediator);
    difficultyStrategy = easyDifficulty;
    game = new GameService(difficultyStrategy).createNewGame(uuid());
    reaction = new Reaction(
      'asdasd',
      reactionDuration,
      difficultyStrategy.maxDeviation,
      [],
      false,
      Date.now()
    );
    gameManager.setCurrentGame(game);
    gameManager.setCurrentReaction(reaction);
  });

  it('easy difficulty should work', () => {
    expect(difficultyStrategy.isGameOver(gameManager)).toEqual(false);
    expect(
      difficultyStrategy.guessIsValid(
        gameManager,
        reactionDuration - difficultyStrategy.maxDeviation
      )
    ).toEqual('GUESS_VALID');
    expect(
      difficultyStrategy.guessIsValid(
        gameManager,
        reactionDuration - difficultyStrategy.maxDeviation - 1
      )
    ).toEqual('GUESS_INVALID_LOW');
  });

  // TODO
  // add other difficulties
  it('other difficulty should work', () => {});
});
