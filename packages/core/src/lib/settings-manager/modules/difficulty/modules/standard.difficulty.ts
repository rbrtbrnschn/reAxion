import { v4 as uuid } from 'uuid';
import {
  AddGuessResponsePayload,
  AddGuessStatus,
  GameManager,
  GameManagerResponse,
  Reaction,
} from '../../../../game-manager';
import {
  DifficultyArgs,
  DifficultyStrategy,
  DifficultyVersionTag,
} from '../difficulty';

export interface DeviationDurationDifficultyArgs extends DifficultyArgs {
  maxDuration: number;
  maxDeviation: number;
}

export interface StandardDifficultyArgs
  extends DeviationDurationDifficultyArgs {
  maxFailedAttempts: number;
}

export class Difficulty implements DifficultyStrategy {
  public key = 'DIFFICULTY';
  public name: string;
  public description: string;
  public version: DifficultyVersionTag;
  public id: string;
  constructor({ name, description, id, version }: DifficultyArgs) {
    this.name = name;
    this.description = description;
    this.version = version;
    this.id = id;
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    throw new Error('Method not implemented.');
  }
  getLifeCount(gameManager: GameManager): number {
    throw new Error('Method not implemented.');
  }
  isGameOver(gameManager: GameManager): boolean {
    throw new Error('Method not implemented.');
  }
  guessIsValid(gameManager: GameManager, guess: number): AddGuessStatus {
    throw new Error('Method not implemented.');
  }
  generateReaction(gameManager: GameManager): Reaction {
    throw new Error('Method not implemented.');
  }
  onReactionStartingSequence(gameManager: GameManager) {
    return;
  }
  onReactionStart(gameManager: GameManager) {
    return;
  }
  onReactionEnd(gameManager: GameManager) {
    return;
  }
  onReactionComplete(gameManager: GameManager) {
    return;
  }
  onGameEnd(gameManager: GameManager) {
    return;
  }
}

export class StandardDifficulty
  extends Difficulty
  implements DifficultyStrategy
{
  public maxFailedAttempts: number;
  public maxDeviation: number;
  public maxDuration: number;

  constructor({
    maxDeviation,
    maxDuration,
    maxFailedAttempts,
    ...base
  }: StandardDifficultyArgs) {
    super(base);
    this.maxDeviation = maxDeviation;
    this.maxDuration = maxDuration;
    this.maxFailedAttempts = maxFailedAttempts;
  }

  handleAddGuess(gameManager: GameManager, guess: number) {
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
      try {
        gameManager.matchProxy.dispatchScoreIncrease();
      } catch (e) {
        console.log(e);
      }
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
      this.maxFailedAttempts - gameManager.getCurrentGame().getFailedAttempts()
    );
  }

  isGameOver(gameManager: GameManager): boolean {
    return (
      gameManager.getCurrentGame().getFailedAttempts() >= this.maxFailedAttempts
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
    const duration = Math.ceil(Math.random() * this.maxDuration);
    const id = uuid();

    return new Reaction(id, duration, this.maxDeviation, [], false);
  }
  onReactionComplete(gameManager: GameManager) {
    gameManager
      .getCurrentGame()
      .setScore(gameManager.getCurrentGame().getScore() + 1);
    return;
  }
}
