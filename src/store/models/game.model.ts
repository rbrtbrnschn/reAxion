import { action, Action, computed, Computed, thunk, Thunk, ThunkOn, thunkOn } from "easy-peasy";
import { GameDifficulty } from "../../enums/difficulty.enum";
import { IGame } from "../../interfaces/game.interface";
import { IReaction } from "../../interfaces/reaction.interface";
import { Injections } from "../injections";
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
  [GameDifficulty.NOT_SELECTED]: {
    deviation: 0,
    maxFailedAttempts: 0,
  },
};

export interface GameModelV2 {
  game: IGame | null;
  history: IGame[];
  difficulty: GameDifficulty;

  setGame: Action<GameModelV2, IGame | null>;
  setHistory: Action<GameModelV2, IGame[]>;
  setGameDifficulty: Action<GameModelV2, GameDifficulty>;

  /* Computed */
  highscore: Computed<GameModelV2, number>;
  currentScore: Computed<GameModelV2, number>;
  currentGameIsOver: Computed<GameModelV2, boolean>;
  currentDeviation: Computed<GameModelV2, number>;
  currentGameDifficulty: Computed<GameModelV2, GameDifficulty>;
  currentFailedAttempts: Computed<GameModelV2, number>;

  /* Setters */
  setCurrentScore: Action<GameModelV2, number>;
  setCurrentName: Action<GameModelV2, string>;
  setCurrentDifficulty: Action<GameModelV2, GameDifficulty>;
  setCurrentFailedAttemps: Action<GameModelV2, number>;
  setCurrentReactions: Action<GameModelV2, IReaction[]>;

  /* Helpers */
  incrementCurrentScore: Thunk<GameModelV2, undefined, Injections, StoreModel>;
  incrementCurrentFailedAttempts: Thunk<
    GameModelV2,
    undefined,
    Injections,
    StoreModel
  >;
  copyToHistory: Thunk<GameModelV2, undefined, Injections, StoreModel>;
  reset: Thunk<GameModelV2, undefined, Injections, StoreModel>;

  /* Listeners */
  onCopyToHistory: ThunkOn<GameModelV2, Injections, StoreModel>;
  onSetCurrentName: ThunkOn<GameModelV2, Injections, StoreModel>;
}

const defaultGame: IGame = {
  difficulty: GameDifficulty.EASY,
  failedAttempts: 0,
  name: "",
  reactions: [],
  score: 0,
};
export const gameModelV2: GameModelV2 = {
  game: defaultGame,
  history: [],
  difficulty: GameDifficulty.EASY,

  setGame: action((state, game) => {
    state.game = game;
  }),
  setHistory: action((state, history) => {
    state.history = history;
  }),
  setGameDifficulty: action((state, difficulty) => {
    state.difficulty = difficulty;
  }),

  /* Computed */
  highscore: computed(
    [
      (state) => {
        if (!state.game) return 0;

        const highscoreInHistory = state.history.reduce(
          (prev, curr) => (prev.score > curr.score ? prev : curr),
          { score: 0 }
        ).score;
        const currentScore = state.game.score;
        return currentScore > highscoreInHistory
          ? currentScore
          : highscoreInHistory;
      },
    ],
    (e) => e
  ),
  currentScore: computed((state) => {
    if (!state.game) return 0;
    return state.game.score;
  }),
  currentGameIsOver: computed((state) => {
    if (!state.game) return false;

    const { maxFailedAttempts } = gameDifficulties[state.game.difficulty];
    return state.currentFailedAttempts === maxFailedAttempts;
  }),
  currentDeviation: computed((state) => {
    if (!state.game) return 0;
    return gameDifficulties[state.game.difficulty].deviation;
  }),
  currentGameDifficulty: computed((state) => {
    if (!state.game) return GameDifficulty.NOT_SELECTED;
    return state.game.difficulty;
  }),
  currentFailedAttempts: computed((state) => {
    return state?.game?.failedAttempts || 0;
  }),

  /* Setters */
  setCurrentScore: action((state, score) => {
    if (!state.game) return;
    state.game.score = score;
  }),
  setCurrentName: action((state, name) => {
    if (!state.game) return;
    state.game.name = name;
  }),
  setCurrentDifficulty: action((state, difficulty) => {
    if (!state.game) return;
    state.game.difficulty = difficulty;
  }),
  setCurrentFailedAttemps: action((state, failedAttempts) => {
    if (!state.game) return;
    state.game.failedAttempts = failedAttempts;
  }),
  setCurrentReactions: action((state, reactions) => {
    if (!state.game) return;
    state.game.reactions = reactions;
  }),

  /* Helpers */
  incrementCurrentFailedAttempts: thunk((actions, _, { fail, getState }) => {
    const state = getState();
    if (!state.game) return fail("No Current Game Found.");

    actions.setCurrentFailedAttemps(state.currentFailedAttempts + 1);
  }),
  incrementCurrentScore: thunk((actions, _, { fail, getState }) => {
    const state = getState();
    if (!state.game) return fail("No Current Game Found.");

    actions.setCurrentScore(state.currentScore + 1);
  }),
  copyToHistory: thunk((actions, _, { getState, getStoreState, fail }) => {
    const state = getState();
    if (!state.game) return fail("No Current Game Found.");

    actions.setHistory([state.game, ...state.history]);
  }),
  reset: thunk((actions, _, { getState,getStoreActions }) => {
    const state = getState();
    const storeActions = getStoreActions();
    
    // refactor to game builder -> inject
    storeActions.reaction.handleGameOver()
    actions.setGame({
      difficulty: state.difficulty,
      failedAttempts: 0,
      name: "",
      reactions: [],
      score: 0,
    });
  }),

  onCopyToHistory: thunkOn((actions)=>actions.copyToHistory, (actions,_,{getState, getStoreState})=>{
    const state = getState();
    const reactionStoreState = getStoreState().reaction;
    const newHistory = [...state.history];
    newHistory[0].reactions = [reactionStoreState.reaction as IReaction,...reactionStoreState.history]; 
    actions.setHistory(newHistory)
  }),
  onSetCurrentName: thunkOn((actions)=>actions.setCurrentName, (actions,_,{})=>{
    actions.copyToHistory();
  })
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
