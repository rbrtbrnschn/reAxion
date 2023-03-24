import { IReaction } from './reaction.interface';
import { IDifficulty } from './settings.interface';
export interface IGameDifficulty {
  deviation: number;
  maxFailedAttempts: number;
  name: string;
  isNotPlayable?: true;
}
export interface IGame {
  score: number;
  difficulty: IDifficulty;
  failedAttempts: number;
  reactions: IReaction[];
  name?: string;
  userId: string;
}

export interface IGameWithStats extends IGame {
  averageDeviation: number;
}
