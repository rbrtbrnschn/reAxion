import {
  IFinishedReaction,
  IGame,
  IGameDifficulty,
  IReaction,
} from '@reaxion/common/interfaces';
import { difficulties } from '@reaxion/core';

export class StatsProcessingService {
  private reactions: IReaction[];
  private difficulty: IGameDifficulty;
  private failedAttempts: number;
  private name: string;
  private score: number;
  constructor(game: IGame) {
    this.reactions = game.reactions;
    this.difficulty = difficulties[game.difficulty.id];
    this.score = game.score;
    this.name = game.name || '';
    this.failedAttempts = game.failedAttempts;
  }

  getGameTime() {
    const lastReaction = this.reactions[
      this.reactions.length - 1
    ] as IFinishedReaction;
    const firstReaction = this.reactions[0] as IFinishedReaction;
    const start = firstReaction?.startedAt || 0;
    const finish = lastReaction?.completedAt || 0;
    if (finish === 0) return 0;
    return Math.abs(finish - start);
  }

  getAverageDeviation() {
    const totalDeviation = this.reactions
      .filter((reaction) => reaction.isGuessed)
      .map((reaction) => {
        if (!reaction) return 0;
        if (!reaction?.guesses.length) return 0;
        return Math.abs(
          reaction.duration - reaction.guesses[reaction.guesses.length - 1]
        );
      })
      .reduce((prev, curr) => curr + prev, 0);
    const averageDeviation = totalDeviation / this.reactions.length;
    return averageDeviation;
  }

  getAverageTimeForCorrectGuess() {
    const filteredReactions = this.reactions.filter(
      (e) => e.isGuessed && e.completedAt && e.startedAt
    ) as IFinishedReaction[];
    return (
      filteredReactions.reduce(
        (prev, curr) => prev + curr?.completedAt - curr?.startedAt,
        0
      ) / filteredReactions.length
    );
  }
}
