import { v4 as uuid } from 'uuid';
import { Settings } from '../../interfaces';
import { Middleware, MiddlewareHandler } from '../../middleware/middleware';
import { DefaultColoring } from '../modules';
import { EasyDifficultyStrategy } from '../modules/difficulty/difficulty';

export class DefaultSettingsHandlerImpl {
  private readonly settings: Settings;

  static readonly defaultSettings: Settings = {
    coloring: new DefaultColoring(),
    difficulty: new EasyDifficultyStrategy(),
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
