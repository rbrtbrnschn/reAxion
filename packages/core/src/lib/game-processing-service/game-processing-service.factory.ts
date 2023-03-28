import { IGame } from '../interfaces/game.interface';
import {
  IDeviationCalculator,
  PrimitiveDeviationCalculator,
  ReactionGuessDeviationCalculator,
} from './caclulator/deviation-calculator/deviation-calculator';
import { GameProcessingService } from './game-processing.service';

export class GameProcessingServiceFactory {
  static create(game: IGame): GameProcessingService {
    let deviationCalculator: IDeviationCalculator =
      new ReactionGuessDeviationCalculator();
    if (game.reactions.length > 0) {
      if (!isNaN(game.reactions[0].guesses[0])) {
        deviationCalculator = new PrimitiveDeviationCalculator();
      } else if (game.reactions[0].guesses[0]?.guess) {
        deviationCalculator = new ReactionGuessDeviationCalculator();
      }
    }
    return new GameProcessingService(game, deviationCalculator);
  }
}
