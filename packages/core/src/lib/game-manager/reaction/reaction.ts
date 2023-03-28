import { IReaction } from '../../interfaces';
import { ReactionGuess } from './guess';

export abstract class BaseReaction implements IReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly id: string,
    public readonly duration: number,
    public readonly deviation: number,
    public guesses: any[],
    public isGuessed: boolean,
    public startedAt?: number,
    public completedAt?: number
  ) {}

  public abstract addGuess(guess: number): void;
  public abstract setIsGuessed(): void;
  public abstract setStartedAt(startedAt: number): void;
  public abstract setCompletedAt(completedAt: number): void;
}

export class ReactionOld extends BaseReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly id: string,
    public readonly duration: number,
    public readonly deviation: number,
    public guesses: number[],
    public isGuessed: boolean,
    public startedAt?: number,
    public completedAt?: number
  ) {
    super(id, duration, deviation, guesses, isGuessed, startedAt, completedAt);
  }

  public addGuess(guess: number) {
    this.guesses = [...this.guesses, guess];
  }
  public setIsGuessed() {
    this.isGuessed = true;
  }
  public setStartedAt(startedAt: number) {
    this.startedAt = startedAt;
  }
  public setCompletedAt(completedAt: number) {
    this.completedAt = completedAt;
  }
}

export class Reaction extends BaseReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly id: string,
    public readonly duration: number,
    public readonly deviation: number,
    public guesses: ReactionGuess[],
    public isGuessed: boolean,
    public startedAt?: number,
    public completedAt?: number
  ) {
    super(id, duration, deviation, guesses, isGuessed, startedAt, completedAt);
  }

  public addGuess(guess: number) {
    this.guesses = [...this.guesses, new ReactionGuess(guess, Date.now())];
  }
  public setIsGuessed() {
    this.isGuessed = true;
  }
  public setStartedAt(startedAt: number) {
    this.startedAt = startedAt;
  }
  public setCompletedAt(completedAt: number) {
    this.completedAt = completedAt;
  }
}
