import { GameDifficulty } from "../enums/difficulty.enum";
import { IReaction } from "./reaction.interface";

export interface IGame {
    score: number;
    difficulty: GameDifficulty;
    name: string;
    failedAttempts: number;
    reactions: IReaction[];
  }