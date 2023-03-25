import { v4 as uuid } from 'uuid';
import { Settings } from '../../interfaces';
import {
  DefaultColoring,
  UnlimitedLivesBut5050ChanceOfGameOverDifficulty,
} from '../modules';

import { SettingDecorator } from './decorators/decorator.interface';

interface DefaultSettingsHandler {
  handle: () => Settings;
}

export class DefaultSettingsHandlerImpl implements DefaultSettingsHandler {
  private readonly settings: Settings;

  static readonly defaultSettings: Settings = {
    coloring: new DefaultColoring(),
    difficulty: new UnlimitedLivesBut5050ChanceOfGameOverDifficulty(),
    userId: uuid(),
    username: '',
  };

  constructor(decorators: SettingDecorator[]) {
    this.settings = decorators.reduce(
      (acc, decorator) => ({ ...acc, ...decorator.decorate() }),
      { ...DefaultSettingsHandlerImpl.defaultSettings }
    );
  }

  handle(): Settings {
    return this.settings;
  }
}
