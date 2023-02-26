import { action, Action, computed, Computed } from "easy-peasy";
import { GameDifficulty } from "../../interfaces/difficulty.interface";
import { StoreModel } from "../store";

export const gameDifficulties: Record<
  GameDifficulty,
  { deviation: number; maxFailedAttempts: number }
> = {
  [GameDifficulty.EASY]: {
    deviation: 500,
    maxFailedAttempts: 5,
  },
  [GameDifficulty.MEDIUM]: {
    deviation: 300,
    maxFailedAttempts: 3,
  },
  [GameDifficulty.HARD]: {
    deviation: 100,
    maxFailedAttempts: 1,
  },
};

export interface GameModel {
  score: number;
  difficulty: GameDifficulty;
  failedAttempts: number;
  deviation: Computed<GameModel, number, StoreModel>;
  isGameOver: Computed<GameModel, boolean, StoreModel>;

  /* Setters */
  setScore: Action<GameModel, number>;
  setDifficulty: Action<GameModel, GameDifficulty>;
  setFailedAttempts: Action<GameModel, number>;

  /* Helpers */
  incrementFailedAttempts: Action<GameModel>;
  incrementScore: Action<GameModel>;
}

export const gameModel: GameModel = {
  score: 0,
  failedAttempts: 0,
  difficulty: GameDifficulty.EASY,
  isGameOver: computed((state) => {
    const { maxFailedAttempts } = gameDifficulties[state.difficulty];
    return state.failedAttempts === maxFailedAttempts;
  }),
  deviation: computed((state) => {
    return gameDifficulties[state.difficulty].deviation;
  }),

  /* Setters */
  setScore: action((state, score) => {
    state.score = score;
  }),
  setDifficulty: action((state, difficulty) => {
    state.difficulty = difficulty;
  }),
  setFailedAttempts: action((state, failedAttempts) => {
    state.failedAttempts = failedAttempts;
  }),

  /* Helpers */
  incrementFailedAttempts: action((state) => {
    state.failedAttempts += 1;
  }),
  incrementScore: action((state) => {
    state.score += 1;
  }),
};
