import { v4 as uuid4 } from 'uuid';
import { ISettings } from '../settings/settings.interface';
import { Game } from './game';
export class GameService {
  constructor(protected settings: ISettings) {}

  public createNewGame(): Game {
    const id = uuid4();

    return new Game(this.settings.difficulty, 0, 0, id, [], []);
  }
}
