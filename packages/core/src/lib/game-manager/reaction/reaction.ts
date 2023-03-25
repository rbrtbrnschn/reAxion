import { IReaction } from '../../interfaces';
import { ReactionGuess } from './guess';

export class Reaction implements IReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly id: string,
    public readonly duration: number,
    public guesses: ReactionGuess[],
    public isGuessed: boolean,
    public startedAt?: number,
    public completedAt?: number
  ) {}

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
