import { GuessStatus, ReactionStatus } from '@reaxion/common';
import { v4 as uuid } from 'uuid';
import { SettingsManager } from '../..';
import {
  GameManager,
  GameManagerMediator,
  GameService,
  Reaction,
} from '../../../game-manager';
import { Game } from '../../../game-manager/game/game';
import { EasyDifficulty } from '../difficulty';
import { EasyDifficultyStrategy } from './difficulty.strategy';

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
    game = new GameService(new EasyDifficulty()).createNewGame(uuid());
    reaction = new Reaction(
      'asdasd',
      reactionDuration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED,
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
    ).toEqual(true);
    expect(
      difficultyStrategy.guessIsValid(
        gameManager,
        reactionDuration - EasyDifficultyStrategy.maxDeviation - 1
      )
    ).toEqual(false);
  });

  // TODO
  // add other difficulties
  it('other difficulty should work', () => {});
});
