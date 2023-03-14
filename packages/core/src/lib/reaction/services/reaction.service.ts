import { IReactionState } from '../interfaces/state.interface';

export class ReactionService {
  constructor(private state: IReactionState) {}
  guessIsRight(guess: number) {
    return guess === this.state.duration;
  }
}
