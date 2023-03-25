import { v4 as uuid } from 'uuid';
import {
  AddGuessResponsePayload,
  AddGuessStatus,
  GameManager,
  GameManagerResponse,
  Reaction,
} from '../../game-manager';
import { Settings } from '../../interfaces';
import { DefaultColoring } from '../modules';
import { DifficultyStrategy } from '../modules/difficulty-strategy/difficulty.strategy';

import { SettingDecorator } from './decorators/decorator.interface';

interface DefaultSettingsHandler {
  handle: () => Settings;
}

class EasyDifficultyStrategy implements DifficultyStrategy {
  public key = 'EASY_DIFFICULTY_STRATEGY';
  public id = this.key;
  public name = this.id;
  static maxFailedAttempts = 5;
  static maxDuration = 3000;
  static maxDeviation = 500;

  handleAddGuess(gameManager: GameManager, guess: number) {
    gameManager.getCurrentReaction().addGuess(guess);

    const guessStatus = this.guessIsValid(gameManager, guess);
    const response = new GameManagerResponse(
      gameManager.getState(),
      gameManager.getCurrentEvent(),
      new AddGuessResponsePayload({
        status: guessStatus,
      })
    );
    gameManager.notify(gameManager.getCurrentEvent(), response);

    gameManager
      .getCurrentGame()
      .setFailedAttempts(gameManager.getCurrentGame().getFailedAttempts() + 1);

    const isValid = guessStatus === 'GUESS_VALID';
    if (isValid) return gameManager.dispatchCompleteReaction();
  }

  handleGameOver(gameManager: GameManager): void {
    const isGameOver = this.isGameOver(gameManager);
    if (isGameOver) return gameManager.dispatchFailGame();
  }

  isGameOver(gameManager: GameManager): boolean {
    return (
      gameManager.getCurrentGame().getFailedAttempts() >=
      EasyDifficultyStrategy.maxFailedAttempts
    );
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    const deviation = Math.abs(
      gameManager.getCurrentGame().getCurrentReaction().duration - guess
    );
    const isValid = deviation <= EasyDifficultyStrategy.maxDeviation;
    const isTooLow =
      !isValid && guess < gameManager.getCurrentReaction().duration;
    return isValid
      ? 'GUESS_VALID'
      : isTooLow
      ? 'GUESS_INVALID_LOW'
      : 'GUESS_INVALID_HIGH';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(
      Math.random() * EasyDifficultyStrategy.maxDuration
    );
    const id = uuid();

    return new Reaction(id, duration, [], false);
  }
  onFailedGuess(gameManager: GameManager) {
    gameManager
      .getCurrentGame()
      .setFailedAttempts(gameManager.getCurrentGame().getFailedAttempts() + 1);
    return;
  }
  onReactionStart(gameManager: GameManager) {
    return;
  }
  onReactionComplete(gameManager: GameManager) {
    gameManager
      .getCurrentGame()
      .setScore(gameManager.getCurrentGame().getScore() + 1);
    return;
  }
  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class DefaultSettingsHandlerImpl implements DefaultSettingsHandler {
  private readonly settings: Settings;

  static readonly defaultSettings: Settings = {
    coloring: new DefaultColoring(),
    difficulty: new EasyDifficultyStrategy(),
    userId: uuid(),
    username: '',
  };

  constructor(decorators: SettingDecorator[]) {
    this.settings = decorators.reduce(
      (acc, decorator) => ({ ...acc, ...decorator.decorate() }),
      { ...DefaultSettingsHandlerImpl.defaultSettings }
    );
  }

  handle(): Settings {
    return this.settings;
  }
}
