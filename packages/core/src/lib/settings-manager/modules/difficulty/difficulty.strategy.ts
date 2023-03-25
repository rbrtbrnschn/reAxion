import { v4 as uuid } from 'uuid';
import { GuessStatus } from '../../../enums/guess.enum';
import { ReactionStatus } from '../../../enums/reaction.enum';
import {
  AddGuessResponsePayload,
  AddGuessStatus,
  GameManager,
  GameManagerResponse,
  Reaction,
} from '../../../game-manager';

export interface DifficultyStrategy {
  key: string;
  name: string;
  id: string;

  handleAddGuess(gameManager: GameManager, guess: number): void;
  handleGameOver(gameManager: GameManager): void;

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

    return new Reaction(
      id,
      duration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED
    );
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
  public key = 'UnlimitedLivesBut5050ChanceOfGameOverDifficulty';
  public id = this.key;
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

    return new Reaction(
      id,
      duration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED
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
  public key = 'VariableDeviationDifficulty';
  public id = this.key;
  public name = this.id;
  static maxDuration = 3000;
  static maxDeviation = 1000;

  handleGameOver(gameManager: GameManager) {
    return;
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    return;
  }

  isGameOver(gameManager: GameManager): boolean {
    // @TODO refactor IReaction.guesses to be objects
    return (
      gameManager.getCurrentGame().getCurrentReaction().guesses[
        gameManager.getCurrentGame().getCurrentReaction().guesses.length - 1
        //@ts-ignore
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

    return new Reaction(
      id,
      duration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED
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

export class TimerOnGuessDifficulty implements DifficultyStrategy {
  public key = 'TimerOnGuessDifficulty';
  public id = this.key;
  public name = this.id;
  static maxDuration = 3000;
  static maxDeviation = 1000;

  handleGameOver(gameManager: GameManager) {
    return;
  }
  handleAddGuess(gameManager: GameManager, guess: number): void {
    return;
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

    return new Reaction(
      id,
      duration,
      [],
      false,
      GuessStatus.IS_WAITING,
      ReactionStatus.HAS_NOT_STARTED
    );
  }
  onReactionStart(gameManager: GameManager) {
    // just pseudo code
    //@ts-ignore
    this.gameManager.setTimer();
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
