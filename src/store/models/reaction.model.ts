import { action, Action, ThunkOn, thunkOn } from "easy-peasy";
import { GuessStatus } from "../../interfaces/guess.interface";
import { ReactionStatus } from "../../interfaces/reaction.interface";
import { GlobalStoreModelV3, InjectionV3 } from "../store";

export interface IReaction {
  duration: number;
  guesses: number[];
  isGuessed: boolean;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;
}

export interface ReactionModel {
  reaction: IReaction | null;
  history: IReaction[];
  setReaction: Action<ReactionModel, IReaction>;
  setHistory: Action<ReactionModel, IReaction[]>;

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
  onSetReaction: ThunkOn<ReactionModel, InjectionV3, GlobalStoreModelV3>;
  onSetReactionStatus: ThunkOn<ReactionModel, InjectionV3, GlobalStoreModelV3>;
}

const defaultReaction: IReaction = {
  duration: 3000,
  guesses: [],
  guessStatus: GuessStatus.IS_WAITING,
  isGuessed: false,
  reactionStatus: ReactionStatus.HAS_NOT_STARTED,
};
export const reactionModel: ReactionModel = {
  reaction: null,
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
  onSetReaction: thunkOn(
    (actions) => actions.setReaction,
    (_, target, { injections }) => {
      injections.loggerService.debug(
        "New Reaction with duration of: " + target.payload.duration + "ms"
      );
    }
  ),
  onSetReactionStatus: thunkOn(
    (actions) => actions.setReactionStatus,
    (_, target, { injections }) => {
      if (target.payload === ReactionStatus.IS_IN_PROGRESS)
        injections.loggerService.debugTime("animation");
      else if (target.payload === ReactionStatus.IS_OVER)
        injections.loggerService.debugTimeEnd("animation");
    }
  ),
};
