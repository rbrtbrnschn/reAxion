import { action, Action, computed, Computed, thunk, Thunk } from "easy-peasy";
import { GameDifficulty } from "../../interfaces/difficulty.interface";
import { IReaction } from "../../interfaces/reaction.interface";
import { Injections } from "../injections";
import { StoreModel } from "../store";

interface IGame {
  score: number;
  name: string;
  difficulty: GameDifficulty;
  reactions: IReaction[];
}

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
  //game: IGame | null;
  score: number;
  difficulty: GameDifficulty;
  failedAttempts: number;
  //name: string;
  //history: IGame[];
  deviation: Computed<GameModel, number, StoreModel>;
  isGameOver: Computed<GameModel, boolean, StoreModel>;

  /* Setters */
  //setName: Action<GameModel, string>;
  setScore: Action<GameModel, number>;
  setDifficulty: Action<GameModel, GameDifficulty>;
  setFailedAttempts: Action<GameModel, number>;

  /* Helpers */
  incrementFailedAttempts: Action<GameModel>;
  incrementScore: Action<GameModel>;
  handleGameOver: Thunk<GameModel, undefined, Injections, StoreModel>;
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
  handleGameOver: thunk((actions, _, helpers) => {
    actions.setDifficulty(GameDifficulty.EASY);
    actions.setFailedAttempts(0);
    actions.setScore(0);

    helpers.getStoreActions().reaction.handleGameOver();
  }),
};
