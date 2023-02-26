import { GuessStatus } from "./guess.interface";

export enum ReactionStatus {
  HAS_NOT_STARTED,
  IS_IN_PROGRESS,
  IS_OVER,
}

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
