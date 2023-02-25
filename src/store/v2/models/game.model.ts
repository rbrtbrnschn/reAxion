import { action, Action } from "easy-peasy";

export interface GameModel {
  highscore: number;
  score: number;
  setHighscore: Action<GameModel, number>;
  setScore: Action<GameModel, number>;
}

export const gameModel: GameModel = {
  highscore: 0,
  score: 0,
  setHighscore: action((state, highscore) => {
    state.highscore = highscore;
  }),
  setScore: action((state, score) => {
    state.score = score;
  }),
};
