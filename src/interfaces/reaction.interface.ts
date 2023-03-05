import { GuessStatus } from "../enums/guess.enum";
import { ReactionStatus } from "../enums/reaction.enum";

export interface IReaction {
  duration: number;
  guesses: number[];
  isGuessed: boolean;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
}

export interface IReactionStatistic extends IReaction {
  deviation: number;
}
