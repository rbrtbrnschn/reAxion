import { v4 as uuid } from 'uuid';
import { Settings } from '../../interfaces';
import { Middleware, MiddlewareHandler } from '../../middleware/middleware';
import { DefaultColoring, easyDifficulty } from '../modules';

export class DefaultSettingsHandlerImpl {
  private readonly settings: Settings;

  static readonly defaultSettings: Settings = {
    coloring: new DefaultColoring(),
    difficulty: easyDifficulty,
    userId: uuid(),
    username: '',
  };

  constructor(public middleware: Middleware<Settings>[]) {
    this.settings = new MiddlewareHandler(this.middleware).handle(
      DefaultSettingsHandlerImpl.defaultSettings
    );
  }

  handle(): Settings {
    return this.settings;
  }
}
