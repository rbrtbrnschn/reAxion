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
  getLifeCount(gameManager: GameManager): number;

  isGameOver(gameManager: GameManager): boolean;
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus;
  generateReaction(gameManager: GameManager): Reaction;

  onReactionStart: (gameManager: GameManager) => void;
  onReactionComplete: (gameManager: GameManager) => void;
  onGameStart: (gameManager: GameManager) => void;
  onGameEnd: (gameManager: GameManager) => void;
}

export class EasyDifficultyStrategy implements DifficultyStrategy {
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'EASY_DIFFICULTY';
  public name = 'Easy';
  static maxFailedAttempts = 5;
  static maxDuration = 3000;
  static maxDeviation = 500;

  handleAddGuess(gameManager: GameManager, guess: number) {
    console.log(this.id, '#handleAddGuess');
    gameManager.getCurrentReaction().addGuess(guess);

    const guessStatus = this.guessIsValid(gameManager, guess);
    const response = new GameManagerResponse(
      gameManager.getState(),
      gameManager.getCurrentEvent(),
      new AddGuessResponsePayload({
        status: guessStatus,
        message: this.getMessageFromGuessStatus(gameManager, guess),
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

    const isGameOver = this.isGameOver(gameManager);
    if (isGameOver) return gameManager.dispatchFailGame();
  }

  getMessageFromGuessStatus(gameManager: GameManager, guess: number): string {
    const status = this.guessIsValid(gameManager, guess);
    return status === 'GUESS_VALID'
      ? 'Correct'
      : status === 'GUESS_INVALID_LOW'
      ? 'Too low.'
      : 'Too High.';
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
    const isValid = deviation <= gameManager.getCurrentReaction().deviation;
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

    return new Reaction(
      id,
      duration,
      EasyDifficultyStrategy.maxDeviation,
      [],
      false
    );
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
// TODO do not use handleGameOver
// put all login in handleAddGuess
export class UnlimitedLivesBut5050ChanceOfGameOverDifficulty
  extends EasyDifficultyStrategy
  implements DifficultyStrategy
{
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'UNLIMITED_LIVES_BUT_50_50_CHANCE_OF_GAME_OVER_DIFFICULTY';
  public name = '50/50';
  static maxDuration = 3000;
  static maxDeviation = 500;

  handleAddGuess(gameManager: GameManager, guess: number) {
    const handleAddGuess = new EasyDifficultyStrategy().handleAddGuess;
    const boundHandleAddGuess = handleAddGuess.bind(this);
    boundHandleAddGuess(gameManager, guess);
  }
  isGameOver(gameManager: GameManager): boolean {
    console.log('ran isgameover');
    const lastGuess = gameManager.getCurrentReaction().guesses.pop();
    if (!lastGuess) throw new NoLastGuessError();
    if (this.guessIsValid(gameManager, lastGuess.guess) === 'GUESS_VALID')
      return false;
    return !!Math.round(Math.random());
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
      Math.random() *
        UnlimitedLivesBut5050ChanceOfGameOverDifficulty.maxDuration
    );
    const id = uuid();

    return new Reaction(
      id,
      duration,
      UnlimitedLivesBut5050ChanceOfGameOverDifficulty.maxDeviation,
      [],
      false
    );
  }
  getLifeCount(gameManager: GameManager): number {
    return '?' as unknown as number;
  }

  onReactionStart(gameManager: GameManager) {
    return;
  }

  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class VariableDeviationDifficulty
  extends EasyDifficultyStrategy
  implements DifficultyStrategy
{
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'VARIABLE_DEVIATION_DIFFICULTY';
  public name = 'Variable Deviation Per Reaction';
  static maxDuration = 3000;
  static maxDeviation = 1000;

  isGameOver(gameManager: GameManager): boolean {
    return (
      gameManager.getCurrentGame().getCurrentReaction().guesses[
        gameManager.getCurrentGame().getCurrentReaction().guesses.length - 1
      ].createdAt <
      (gameManager.getCurrentGame().getCurrentReaction()?.startedAt ||
        new Date().getTime())
    );
  }
  generateReaction(): Reaction {
    const currentMaxDeviation = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDeviation
    );
    const duration = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDuration
    );
    const id = uuid();

    return new Reaction(id, duration, currentMaxDeviation, [], false);
  }

  onReactionStart(gameManager: GameManager) {
    return;
  }

  onGameStart(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class TimerOnGuessDifficulty
  extends EasyDifficultyStrategy
  implements DifficultyStrategy
{
  public key = 'DIFFICULTY_STRATEGY';
  public id = 'TIMER_ON_GUESS_DIFFICULTY';
  public name = '3s Timer On Guess';
  static maxDuration = 3000;
  static maxDeviation = 1000;

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
    const isApplicableForValidation =
      gameManager.getCurrentGame().getCurrentReaction().guesses[
        gameManager.getCurrentGame().getCurrentReaction().guesses.length - 1
      ].createdAt <
      (gameManager.getCurrentGame().getCurrentReaction()?.startedAt ||
        new Date().getTime()) +
        3000;
    const deviation = Math.abs(
      gameManager.getCurrentGame().getCurrentReaction().duration - guess
    );
    const isValid =
      isApplicableForValidation &&
      deviation <= gameManager.getCurrentReaction().deviation;
    const isLow =
      isApplicableForValidation &&
      !isValid &&
      guess < gameManager.getCurrentReaction().deviation;
    const isHigh =
      isApplicableForValidation &&
      !isValid &&
      guess > gameManager.getCurrentReaction().deviation;
    return isValid
      ? 'GUESS_VALID'
      : isLow
      ? 'GUESS_INVALID_LOW'
      : isHigh
      ? 'GUESS_INVALID_HIGH'
      : 'GUESS_TIMEOUT';
  }
  getMessageFromGuessStatus(gameManager: GameManager, guess: number): string {
    const status = this.guessIsValid(gameManager, guess);
    return status === 'GUESS_VALID'
      ? 'Correct'
      : status === 'GUESS_INVALID_LOW'
      ? 'Too low.'
      : status === 'GUESS_INVALID_HIGH'
      ? 'Too High.'
      : status === 'GUESS_TIMEOUT'
      ? 'Took too long.'
      : '';
  }
  generateReaction(): Reaction {
    const duration = Math.ceil(
      Math.random() * EasyDifficultyStrategy.maxDuration
    );
    const id = uuid();

    return new Reaction(
      id,
      duration,
      TimerOnGuessDifficulty.maxDeviation,
      [],
      false
    );
  }
  onReactionStart(gameManager: GameManager) {
    // just pseudo code
    //@ts-ignore
    //this.gameManager.setTimer();
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

class NoLastGuessError extends Error {
  constructor() {
    super('No Last Guess Found.');
  }
}
