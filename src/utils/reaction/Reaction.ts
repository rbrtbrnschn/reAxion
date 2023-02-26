import { GuessStatus } from "../../interfaces/v2/guess.interface";
import { ReactionStatus } from "../../interfaces/v2/reaction.interface";
import { IReaction } from "../../store/v3/models/reaction.model";

export class Reaction implements IReaction {
  duration: number;
  guesses: number[];
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
  isGuessed: boolean;
  constructor({
    duration,
    guesses,
    guessStatus,
    reactionStatus,
    isGuessed,
  }: IReaction) {
    this.duration = duration;
    this.guesses = guesses;
    this.guessStatus = guessStatus;
    this.reactionStatus = reactionStatus;
    this.isGuessed = isGuessed;
  }
}
