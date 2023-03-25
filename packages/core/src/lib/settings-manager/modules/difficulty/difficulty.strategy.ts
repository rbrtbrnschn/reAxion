import { GuessStatus, IReaction, ReactionStatus } from '@reaxion/common';
import { v4 as uuid } from 'uuid';
import { GameManager, Reaction } from '../../../game-manager';

export interface DifficultyStrategy {
  key: string;
  isGameOver(gameManager: GameManager): boolean;
  guessIsValid(gameManager: GameManager, guess: number): boolean;
  generateReaction(gameManager: GameManager): IReaction;

  onReactionStart: (gameManager: GameManager) => void;
  onReactionComplete: (gameManager: GameManager) => void;
  onGameStart: (gameManager: GameManager) => void;
  onGameEnd: (gameManager: GameManager) => void;
}

export class EasyDifficultyStrategy implements DifficultyStrategy {
  public key = 'EASY_DIFFICULTY_STRATEGY';
  static maxFailedAttempts = 5;
  static maxDuration = 3000;
  static maxDeviation = 500;

  isGameOver(gameManager: GameManager): boolean {
    return (
      gameManager.getCurrentGame().getFailedAttempts() >=
      EasyDifficultyStrategy.maxFailedAttempts
    );
  }
  guessIsValid(gameManager: GameManager, guess: number): boolean {
    return (
      Math.abs(
        gameManager.getCurrentGame().getCurrentReaction().duration - guess
      ) <= 500
    );
  }
  generateReaction(): IReaction {
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

export class UnlimitedLivesBut5050ChanceOfGameOverDifficulty
  implements DifficultyStrategy
{
  public key = 'UnlimitedLivesBut5050ChanceOfGameOverDifficulty';
  static maxDuration = 3000;
  static maxDeviation = 500;

  isGameOver(gameManager: GameManager): boolean {
    return !!Math.round(Math.random());
  }
  guessIsValid(gameManager: GameManager, guess: number): boolean {
    return (
      Math.abs(
        gameManager.getCurrentGame().getCurrentReaction().duration - guess
      ) <= 500
    );
  }
  generateReaction(): IReaction {
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
  static maxDuration = 3000;
  static maxDeviation = 1000;

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
  guessIsValid(gameManager: GameManager, guess: number): boolean {
    const currentMaxDeviation = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDeviation
    );
    return (
      Math.abs(gameManager.getCurrentReaction().duration - guess) <=
      currentMaxDeviation
    );
  }
  generateReaction(): IReaction {
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

export class TimerOnGuess implements DifficultyStrategy {
  public key = 'TimerOnGuessDifficulty';
  static maxDuration = 3000;
  static maxDeviation = 1000;

  isGameOver(): boolean {
    return !!Math.round(Math.random());
  }
  guessIsValid(gameManager: GameManager, guess: number): boolean {
    const currentMaxDeviation = Math.ceil(
      Math.random() * VariableDeviationDifficulty.maxDeviation
    );
    return (
      Math.abs(gameManager.getCurrentReaction().duration - guess) <=
      currentMaxDeviation
    );
  }
  generateReaction(): IReaction {
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
