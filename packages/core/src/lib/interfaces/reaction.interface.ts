import { ReactionGuess } from '../game-manager';

export interface IReaction {
  duration: number;
  guesses: ReactionGuess[];
  isGuessed: boolean;
  startedAt?: number;
  completedAt?: number;
  id: string;
}

export interface IFinishedReaction extends IReaction {
  startedAt: number;
  completedAt: number;
}

export interface IReactionStatistic extends IReaction {
  deviation: number;
}
