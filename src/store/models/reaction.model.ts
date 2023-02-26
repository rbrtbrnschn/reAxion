import { action, Action, ThunkOn, thunkOn } from "easy-peasy";
import { GuessStatus } from "../../interfaces/guess.interface";
import { IReaction, ReactionStatus } from "../../interfaces/reaction.interface";
import { Injections } from "../injections";
import { StoreModel } from "../store";

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
  onAddGuess: ThunkOn<ReactionModel, any, StoreModel>;
  onSetReaction: ThunkOn<ReactionModel, Injections, StoreModel>;
  onSetReactionStatus: ThunkOn<ReactionModel, Injections, StoreModel>;
}

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
      const { isGameOver } = helpers.getStoreState().game;
      const guess = target.payload;

      if (isGameOver) return helpers.fail("Game Over. Cannot add guess.");
      if (!state.reaction)
        throw new Error("added Guess to non-existant state.reaction");

      const difference = Math.abs(guess - state.reaction.duration);
      const deviation = helpers.getStoreState().game.deviation;

      const isCorrect = difference <= deviation;
      const isTooHigh = guess > state.reaction.duration;

      if (isCorrect) {
        state.reaction.guessStatus = GuessStatus.IS_RIGHT;
        state.reaction.isGuessed = true;
        actions.copyToHistory();
        helpers.getStoreActions().game.incrementScore();
        return;
      }
      if (isTooHigh) state.reaction.guessStatus = GuessStatus.IS_TOO_HIGH;
      else state.reaction.guessStatus = GuessStatus.IS_TOO_LOW;

      helpers.getStoreActions().game.incrementFailedAttempts();
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
