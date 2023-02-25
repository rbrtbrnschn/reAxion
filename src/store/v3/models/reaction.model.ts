import { action, Action, ThunkOn, thunkOn } from "easy-peasy";
import { GuessStatus } from "../../../interfaces/v2/guess.interface";
import { ReactionStatus } from "../../../interfaces/v2/reaction.interface";
import { GlobalStoreModelV3 } from "../store";

export interface Reaction {
  duration: number;
  guesses: number[];
  isGuessed: boolean;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
}

export interface ReactionModel {
  reaction: Reaction | null;
  history: Reaction[];
  setReaction: Action<ReactionModel, Reaction>;
  setHistory: Action<ReactionModel, Reaction[]>;

  /* Setters */
  setGuesses: Action<ReactionModel, number[]>;
  setIsGuessed: Action<ReactionModel, boolean>;
  setGuessStatus: Action<ReactionModel, GuessStatus>;
  setReactionStatus: Action<ReactionModel, ReactionStatus>;

  /* Helpers */
  addGuess: Action<ReactionModel, number>;
  copyToHistory: Action<ReactionModel>;

  /* Listeners */
  onAddGuess: ThunkOn<ReactionModel, any, GlobalStoreModelV3>;
}

const defaultReaction: Reaction = {
  duration: 3000,
  guesses: [],
  guessStatus: GuessStatus.IS_WAITING,
  isGuessed: false,
  reactionStatus: ReactionStatus.HAS_NOT_STARTED,
};
export const reactionModel: ReactionModel = {
  reaction: defaultReaction,
  history: [],

  /* Setters */
  setReaction: action((state, reaction) => {
    state.reaction = reaction;
  }),
  setHistory: action((state, history) => {
    state.history = history;
  }),
  setGuesses: action((state, guesses) => {
    if (!state.reaction) return;
    state.reaction.guesses = guesses;
  }),
  setIsGuessed: action((state, isGuessed) => {
    if (!state.reaction) return;
    state.reaction.isGuessed = isGuessed;
  }),
  setGuessStatus: action((state, guessStatus) => {
    if (!state.reaction) return;
    state.reaction.guessStatus = guessStatus;
  }),
  setReactionStatus: action((state, reactionStatus) => {
    if (!state.reaction) return;
    state.reaction.reactionStatus = reactionStatus;
  }),
  addGuess: action((state, guess) => {
    if (!state.reaction) return;
    state.reaction.guesses.push(guess);
  }),
  copyToHistory: action((state) => {
    if (!state.reaction) return;
    state.history.push(state.reaction);
  }),

  /* Listeners */
  onAddGuess: thunkOn(
    (actions) => actions.addGuess,
    (actions, target, helpers) => {
      const state = helpers.getState();

      const guess = target.payload;
      if (!state.reaction)
        throw new Error("added Guess to non-existant state.reaction");

      if (guess === state.reaction.duration) {
        state.reaction.guessStatus = GuessStatus.IS_RIGHT;
        state.reaction.isGuessed = true;
        actions.copyToHistory();
      } else if (guess > state.reaction.duration)
        state.reaction.guessStatus = GuessStatus.IS_TOO_HIGH;
      else if (guess < state.reaction.duration)
        state.reaction.guessStatus = GuessStatus.IS_TOO_LOW;
      else state.reaction.guessStatus = GuessStatus.IS_WAITING;
    }
  ),
};
