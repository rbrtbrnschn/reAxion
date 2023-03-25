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

export interface DifficultyStrategy {
  key: string;
  name: string;
  id: string;

  handleAddGuess(gameManager: GameManager, guess: number): void;
  handleGameOver(gameManager: GameManager): void;
  getLifeCount(gameManager: GameManager): number;

  isGameOver(gameManager: GameManager): boolean;
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus;
  generateReaction(gameManager: GameManager): Reaction;

  // onFailedGuess: (gameManager: GameManager) => void;

  onReactionStart: (gameManager: GameManager) => void;
  onReactionComplete: (gameManager: GameManager) => void;
  onGameStart: (gameManager: GameManager) => void;
  onGameEnd: (gameManager: GameManager) => void;
}

export class EasyDifficultyStrategy implements DifficultyStrategy {
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

    const isValid = guessStatus === 'GUESS_VALID';
    if (isValid) {
      gameManager.notify(gameManager.getCurrentEvent(), response);
      return gameManager.dispatchCompleteReaction();
    }

    gameManager
      .getCurrentGame()
      .setFailedAttempts(gameManager.getCurrentGame().getFailedAttempts() + 1);
    gameManager.notify(gameManager.getCurrentEvent(), response);
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

export class UnlimitedLivesBut5050ChanceOfGameOverDifficulty
  implements DifficultyStrategy
{
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'UNLIMITED_LIVES_BUT_50_50_CHANCE_OF_GAME_OVER_DIFFICULTY';
  public name = this.id;
  static maxDuration = 3000;
  static maxDeviation = 500;

  handleAddGuess(gameManager: GameManager) {
    return;
  }
  handleGameOver(gameManager: GameManager): void {
    return;
  }
  isGameOver(gameManager: GameManager): boolean {
    return !!Math.round(Math.random());
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    // return (
    //   Math.abs(
    //     gameManager.getCurrentGame().getCurrentReaction().duration - guess
    //   ) <= 500
    // );
    return 'GUESS_VALID';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(
      Math.random() * EasyDifficultyStrategy.maxDuration
    );
    const id = uuid();

    return new Reaction(id, duration, [], false);
  }
  getLifeCount(gameManager: GameManager): number {
    return (
      EasyDifficultyStrategy.maxFailedAttempts -
      gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  onReactionStart(gameManager: GameManager) {
    return;
  }
  onReactionComplete(gameManager: GameManager) {
    return;
  }
  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class VariableDeviationDifficulty implements DifficultyStrategy {
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'VARIABLE_DEVIATION_DIFFICULTY';
  public name = this.id;
  static maxDuration = 3000;
  static maxDeviation = 1000;

  handleGameOver(gameManager: GameManager) {
    return;
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    return;
  }
  getLifeCount(gameManager: GameManager): number {
    return (
      EasyDifficultyStrategy.maxFailedAttempts -
      gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  isGameOver(gameManager: GameManager): boolean {
    // @TODO refactor IReaction.guesses to be objects
    return (
      gameManager.getCurrentGame().getCurrentReaction().guesses[
        gameManager.getCurrentGame().getCurrentReaction().guesses.length - 1
      ].createdAt <
      (gameManager.getCurrentGame().getCurrentReaction()?.startedAt ||
        new Date().getTime())
    );
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    const currentMaxDeviation = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDeviation
    );
    // return (
    //   Math.abs(gameManager.getCurrentReaction().duration - guess) <=
    //   currentMaxDeviation
    // );
    return 'GUESS_VALID';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(
      Math.random() * EasyDifficultyStrategy.maxDuration
    );
    const id = uuid();

    return new Reaction(id, duration, [], false);
  }

  onReactionStart(gameManager: GameManager) {
    return;
  }
  onReactionComplete(gameManager: GameManager) {
    return;
  }
  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class TimerOnGuessDifficulty implements DifficultyStrategy {
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'TIMER_ON_GUESS_DIFFICULTY';
  public name = this.id;
  static maxDuration = 3000;
  static maxDeviation = 1000;

  handleGameOver(gameManager: GameManager) {
    return;
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    return;
  }
  getLifeCount(gameManager: GameManager): number {
    return (
      EasyDifficultyStrategy.maxFailedAttempts -
      gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  isGameOver(): boolean {
    return !!Math.round(Math.random());
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    const currentMaxDeviation = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDeviation
    );
    // return (
    //   Math.abs(gameManager.getCurrentReaction().duration - guess) <=
    //   currentMaxDeviation
    // );
    return 'GUESS_VALID';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(
      Math.random() * EasyDifficultyStrategy.maxDuration
    );
    const id = uuid();

    return new Reaction(id, duration, [], false);
  }
  onReactionStart(gameManager: GameManager) {
    // just pseudo code
    //@ts-ignore
    //this.gameManager.setTimer();
  }
  onReactionComplete(gameManager: GameManager) {
    return;
  }
  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export const difficulties: Record<
  DifficultyStrategy['id'],
  DifficultyStrategy
> = {
  EASY_DIFFICULTY_STRATEGY: new EasyDifficultyStrategy(),
  UnlimitedLivesBut5050ChanceOfGameOverDifficulty:
    new UnlimitedLivesBut5050ChanceOfGameOverDifficulty(),
  VariableDeviationDifficulty: new VariableDeviationDifficulty(),
  TimerOnGuessDifficulty: new TimerOnGuessDifficulty(),
};

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
