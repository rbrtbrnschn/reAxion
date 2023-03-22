import { IGame } from '../../interfaces/game.interface';

/**
 * Processes IGame and calculates average deviation.
 * @param games {IGame}
 * @returns {number} - average deviation in ms
 */
export function gameToAverageDeviation(game: IGame): number {
  const totalDeviation = game.reactions
    .filter((reaction) => reaction?.isGuessed)
    .map((reaction) => {
      if (!reaction) return 0;
      if (!reaction?.guesses.length) return 0;
      return Math.abs(
        reaction.duration - reaction.guesses[reaction.guesses.length - 1]
      );
    })
    .reduce((prev, curr) => curr + prev, 0);
  const averageDeviation =
    totalDeviation / game.reactions.filter((r) => r.isGuessed).length;
  return averageDeviation;
}
