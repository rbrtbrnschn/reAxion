import { IReaction } from "./reaction.interface";

export interface IGame {
  highscore: number;
  score: number;
  reaction: IReaction;
}
