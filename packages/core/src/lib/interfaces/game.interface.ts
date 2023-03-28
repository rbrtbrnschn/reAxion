import { DifficultyStrategy } from '../settings-manager/modules/difficulty-strategy/difficulty.strategy';
import { IReaction } from './reaction.interface';
export interface IGameDifficulty {
  deviation: number;
  maxFailedAttempts: number;
  name: string;
  isNotPlayable?: true;
}
export interface IGame {
  score: number;
  difficulty: DifficultyStrategy;
  failedAttempts: number;
  reactions: IReaction[];
  name?: string;
  userId: string;
  startedAt?: number;
  endedAt?: number;
}
export interface IFinishedGame extends IGame {
  startedAt: number;
  endedAt: number;
  name: string;
}

export interface IGameWithStats extends IGame {
  averageDeviation: number;
}
