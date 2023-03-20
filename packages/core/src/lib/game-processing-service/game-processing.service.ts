import {
  IFinishedReaction,
  IGame,
  IGameDifficulty,
  IReaction,
} from '@reaxion/common/interfaces';
import { difficulties } from '../game-manager/settings';

export class GameProcessingService {
  private reactions: IReaction[];
  private guessedReactions: IFinishedReaction[];
  private difficulty: IGameDifficulty;
  private failedAttempts: number;
  private name: string;
  private score: number;
  constructor(game: IGame) {
    this.reactions = game.reactions;
    this.guessedReactions = this.reactions?.filter(
      (r) => r.isGuessed
    ) as IFinishedReaction[];
    this.difficulty = difficulties[game.difficulty.id];
    this.score = game.score;
    this.name = game.name || '';
    this.failedAttempts = game.failedAttempts;
  }

  getGameTime() {
    return this.guessedReactions.map(toReactionDuration).reduce(toSum, 0);
  }

  getAverageDeviation() {
    const totalDeviation = this.guessedReactions
      .map(toReactionDeviation)
      .reduce(toSum, 0);
    return totalDeviation / this.guessedReactions.length;
  }

  getAverageTimeForCorrectGuess() {
    return this.getGameTime() / this.guessedReactions.length;
  }
}

const toSum = (prev: number, curr: number) => prev + curr;
const toReactionDuration = (r: IFinishedReaction) =>
  r.completedAt - r.startedAt;
const toReactionDeviation = (r: IFinishedReaction) =>
  Math.abs(r.duration - (r.guesses.pop() || 0));