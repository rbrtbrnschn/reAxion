import { action, Action } from "easy-peasy";
import { GuessStatus } from "../../../interfaces/v2/guess.interface";
import { ReactionStatus } from "../../../interfaces/v2/reaction.interface";

export interface ReactionModel {
  duration: number;
  guess: number;
  guessStatus: GuessStatus;
  reactionStatus: ReactionStatus;

  setDuration: Action<ReactionModel, number>;
  setGuess: Action<ReactionModel, number>;
  setGuessStatus: Action<ReactionModel, GuessStatus>;
  setReactionStatus: Action<ReactionModel, ReactionStatus>;
}

export const reactionModel: ReactionModel = {
  duration: 0,
  guess: 0,
  guessStatus: GuessStatus.IS_WAITING,
  reactionStatus: ReactionStatus.HAS_NOT_STARTED,

  setDuration: action((state, duration) => {
    state.duration = duration;
  }),
  setGuess: action((state, guess) => {
    state.guess = guess;
  }),
  setGuessStatus: action((state, guessStatus) => {
    state.guessStatus = guessStatus;
  }),
  setReactionStatus: action((state, reactionStatus) => {
    state.reactionStatus = reactionStatus;
  }),
};
