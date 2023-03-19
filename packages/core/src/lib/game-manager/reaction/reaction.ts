import { GuessStatus, IReaction, ReactionStatus } from '@reaxion/common';

export class Reaction implements IReaction {
  public readonly key = 'REACTION_CLASS';
  constructor(
    public readonly id: string,
    public readonly duration: number,
    public guesses: number[],
    public isGuessed: boolean,
    public guessStatus: GuessStatus,
    public reactionStatus: ReactionStatus,
    public startedAt?: number,
    public completedAt?: number
  ) {}

  public addGuess(guess: number) {
    this.guesses = [...this.guesses, guess];
  }
  public setIsGuessed() {
    this.isGuessed = true;
  }
  public setGuessStatus(guessStatus: GuessStatus) {
    this.guessStatus = guessStatus;
  }
  public setReactionStatus(reactionStatus: ReactionStatus) {
    this.reactionStatus = reactionStatus;
  }
  public setStartedAt(startedAt: number) {
    this.startedAt = startedAt;
  }
  public setCompletedAt(completedAt: number) {
    this.completedAt = completedAt;
  }
}
