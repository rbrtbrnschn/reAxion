import { GuessStatus } from "../enums/guess.enum";
import { ReactionStatus } from "../enums/reaction.enum";

export interface IReaction {
  duration: number;
  guesses: number[];
  isGuessed: boolean;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
  startedAt?: number;
  completedAt?: number;
  _id: string;
}

export interface IFinishedReaction extends IReaction {
  startedAt: number;
  completedAt: number;
}

export interface IReactionStatistic extends IReaction {
  deviation: number;
}
