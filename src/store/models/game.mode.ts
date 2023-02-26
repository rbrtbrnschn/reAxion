import { action, Action, computed, Computed } from "easy-peasy";
import { StoreModel } from "../store";

enum GameDifficulty {
  EASY,
  MEDIUM,
  HARD,
}
export interface GameModel {
  score: number;
  difficulty: GameDifficulty;
  deviation: Computed<GameModel, number, StoreModel>;

  setScore: Action<GameModel, number>;
  setDifficulty: Action<GameModel, GameDifficulty>;
}

export const gameModel: GameModel = {
  score: 0,
  difficulty: GameDifficulty.EASY,
  deviation: computed(
    [
      (state, storeState) => {
        let deviation;
        switch (state.difficulty) {
          case GameDifficulty.EASY:
            deviation = 500;
            break;
          case GameDifficulty.MEDIUM:
            deviation = 300;
            break;
          case GameDifficulty.HARD:
            deviation = 100;
            break;
          default:
            deviation = 500;
            break;
        }
        return deviation;
      },
    ],
    (e) => e
  ),

  setScore: action((state, score) => {
    state.score = score;
  }),
  setDifficulty: action((state, difficulty) => {
    state.difficulty = difficulty;
  }),
};
