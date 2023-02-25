import { GuessStatus } from "./guess.interface";

export enum ReactionStatus {
  HAS_NOT_STARTED,
  IS_IN_PROGRESS,
  IS_OVER,
}

export interface IReaction {
  duration: number;
  guess: number;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
}
