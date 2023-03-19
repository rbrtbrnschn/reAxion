import { ISettings } from '@reaxion/common/interfaces';
import { v4 as uuid4 } from 'uuid';
import { Game } from './game';
export class GameService {
  constructor(protected settings: ISettings) {}

  public createNewGame(userId: string): Game {
    const id = uuid4();

    return new Game(userId, this.settings.difficulty, 0, 0, id, [], []);
  }
}
