import { v4 as uuid4 } from 'uuid';
import { DifficultyStrategy } from '../../settings-manager';
import { Game } from './game';
export class GameService {
  constructor(protected difficulty: DifficultyStrategy) {}

  public createNewGame(userId: string): Game {
    const id = uuid4();

    return new Game(userId, this.difficulty, 0, 0, id, [], []);
  }
}
