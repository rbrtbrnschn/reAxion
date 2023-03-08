import { GameDifficulty } from "../enums/difficulty.enum";
import { IReaction } from "./reaction.interface";
export interface IGameDifficulty { deviation: number; maxFailedAttempts: number, name: string, isNotPlayable?: true }
export interface IGame {
    score: number;
    difficulty: GameDifficulty;
    name: string;
    failedAttempts: number;
    reactions: IReaction[];
  }