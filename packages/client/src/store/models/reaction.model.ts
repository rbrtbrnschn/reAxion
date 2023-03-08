import { GuessStatus, ReactionStatus } from '@reaxion/common/enums';
import { IReaction } from '@reaxion/common/interfaces';
import { action, Action, thunk, Thunk, ThunkOn, thunkOn } from 'easy-peasy';
import { Injections } from '../injections';
import { StoreModel } from '../store';

export interface ReactionModel {
  reaction: IReaction | null;
  history: IReaction[];
  setReaction: Action<ReactionModel, IReaction | null>;
  setHistory: Action<ReactionModel, IReaction[]>;

  /* Setters */
  setGuesses: Action<ReactionModel, number[]>;
  setIsGuessed: Action<ReactionModel, boolean>;
  setGuessStatus: Action<ReactionModel, GuessStatus>;
  setReactionStatus: Action<ReactionModel, ReactionStatus>;
  setStartedAt: Action<ReactionModel>;
  setCompletedAt: Action<ReactionModel>;

  /* Helpers */
  addGuess: Action<ReactionModel, number>;
  copyToHistory: Action<ReactionModel>;
  handleGameOver: Thunk<ReactionModel, undefined, Injections, StoreModel>;

  /* Listeners */
  onAddGuess: ThunkOn<ReactionModel, any, StoreModel>;
  onSetReaction: ThunkOn<ReactionModel, Injections, StoreModel>;
  onSetReactionStatus: ThunkOn<ReactionModel, Injections, StoreModel>;
}

export const reactionModelV2: ReactionModel = {
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
  setStartedAt: action((state) => {
    if (!state.reaction) return;
    state.reaction.startedAt = Date.now();
  }),
  setCompletedAt: action((state) => {
    if (!state.reaction) return;
    state.reaction.completedAt = Date.now();
  }),

  addGuess: action((state, guess) => {
    if (!state.reaction) return;
    state.reaction.guesses.push(guess);
  }),
  copyToHistory: action((state) => {
    if (!state.reaction) return;
    state.history.push(state.reaction);
  }),
  handleGameOver: thunk((actions, _, { injections }) => {
    actions.setReaction(null);
    actions.setHistory([]);
  }),

  /* Listeners */
  onAddGuess: thunkOn(
    (actions) => actions.addGuess,
    (actions, target, helpers) => {
      const state = helpers.getState();
      const { currentGameIsOver } = helpers.getStoreState().game;
      const guess = target.payload;

      if (currentGameIsOver)
        return helpers.fail('Game Over. Cannot add guess.');
      if (!state.reaction)
        throw new Error('added Guess to non-existant state.reaction');

      const difference = Math.abs(guess - state.reaction.duration);
      const deviation = helpers.getStoreState().game.currentDeviation;

      const isCorrect = difference <= deviation;
      const isTooHigh = guess > state.reaction.duration;

      if (isCorrect) {
        state.reaction.completedAt = Date.now();
        state.reaction.guessStatus = GuessStatus.IS_RIGHT;
        state.reaction.isGuessed = true;
        actions.copyToHistory();
        helpers.getStoreActions().game.incrementCurrentScore();
        return;
      }
      if (isTooHigh) state.reaction.guessStatus = GuessStatus.IS_TOO_HIGH;
      else state.reaction.guessStatus = GuessStatus.IS_TOO_LOW;

      helpers.getStoreActions().game.incrementCurrentFailedAttempts();
    }
  ),
  onSetReaction: thunkOn(
    (actions) => actions.setReaction,
    (_, target, { injections }) => {
      if (target.payload) {
        injections.loggerService.debug(
          'New Reaction with duration of: ' + target.payload?.duration + 'ms'
        );
      } else {
        injections.loggerService.debug('Set Reaction to null');
      }
    }
  ),
  onSetReactionStatus: thunkOn(
    (actions) => actions.setReactionStatus,
    (actions, target, { injections }) => {
      if (target.payload === ReactionStatus.IS_IN_PROGRESS)
        injections.loggerService.debugTime('animation');
      else if (target.payload === ReactionStatus.IS_OVER) {
        injections.loggerService.debugTimeEnd('animation');
        actions.setStartedAt();
      }
    }
  ),
};
