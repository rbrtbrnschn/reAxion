import { v4 as uuid } from 'uuid';
import { SettingsManager } from '..';
import {
  GameManager,
  GameManagerMediator,
  GameService,
  Reaction,
} from '../../game-manager';
import { Game } from '../../game-manager/game/game';
import { EasyDifficultyStrategy } from '../modules/difficulty/difficulty';

describe('EasyDifficultyStrategy', () => {
  let game: Game;
  let difficultyStrategy: EasyDifficultyStrategy;
  let gameManager: GameManager;
  let reaction: Reaction;
  const reactionDuration = 1000;

  beforeEach(() => {
    const mediator = new GameManagerMediator(new SettingsManager());
    gameManager = new GameManager(mediator);
    difficultyStrategy = new EasyDifficultyStrategy();
    game = new GameService(new EasyDifficultyStrategy()).createNewGame(uuid());
    reaction = new Reaction(
      'asdasd',
      reactionDuration,
      EasyDifficultyStrategy.maxDeviation,
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
        reactionDuration - EasyDifficultyStrategy.maxDeviation
      )
    ).toEqual('GUESS_VALID');
    expect(
      difficultyStrategy.guessIsValid(
        gameManager,
        reactionDuration - EasyDifficultyStrategy.maxDeviation - 1
      )
    ).toEqual('GUESS_INVALID_LOW');
  });

  // TODO
  // add other difficulties
  it('other difficulty should work', () => {});
});
