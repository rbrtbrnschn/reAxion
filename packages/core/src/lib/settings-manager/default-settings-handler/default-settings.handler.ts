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

class EasyDifficultyStrategy implements DifficultyStrategy {
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'EASY_DIFFICULTY';
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

    const isValid = guessStatus === 'GUESS_VALID';
    if (isValid) return gameManager.dispatchCompleteReaction();

    gameManager
      .getCurrentGame()
      .setFailedAttempts(gameManager.getCurrentGame().getFailedAttempts() + 1);
  }

  handleGameOver(gameManager: GameManager): void {
    const isGameOver = this.isGameOver(gameManager);
    if (isGameOver) return gameManager.dispatchFailGame();
  }

  getLifeCount(gameManager: GameManager): number {
    return (
      EasyDifficultyStrategy.maxFailedAttempts -
      gameManager.getCurrentGame().getFailedAttempts()
    );
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

export class DefaultSettingsHandlerImpl {
  private readonly settings: Settings;

  static readonly defaultSettings: Settings = {
    coloring: new DefaultColoring(),
    difficulty: new EasyDifficultyStrategy(),
    userId: uuid(),
    username: '',
  };

  constructor(public middleware: Middleware<Settings>[]) {
    this.settings = new MiddlewareHandler(this.middleware).handle(
      DefaultSettingsHandlerImpl.defaultSettings
    );
  }

  handle(): Settings {
    return this.settings;
  }
}

export interface Middleware<T> {
  (context: T, next: () => T): T;
}

export class MiddlewareHandler<T> {
  private readonly middleware: Middleware<T>[];

  constructor(middleware: Middleware<T>[]) {
    this.middleware = middleware;
  }

  handle(context: T): T {
    const firstMiddleware = this.middleware[0];

    const finalMiddleware = this.middleware.reduceRight(
      //@ts-ignore
      (next, middleware) => () => middleware(context, next),
      () => context
    );

    return this.middleware.length
      ? //@ts-ignore
        firstMiddleware(context, finalMiddleware)
      : context;
  }
}
