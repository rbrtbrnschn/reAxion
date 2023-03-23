import { ISettings } from '@reaxion/common';
import { v4 as uuid } from 'uuid';
import { DefaultColoring, EasyDifficulty } from '../modules';
import { SettingDecorator } from './decorators/decorator.interface';

interface DefaultSettingsHandler {
  handle: () => ISettings;
}

export class DefaultSettingsHandlerImpl implements DefaultSettingsHandler {
  private readonly settings: ISettings;

  static readonly defaultSettings: ISettings = {
    coloring: new DefaultColoring(),
    difficulty: new EasyDifficulty(),
    userId: uuid(),
    username: '',
  };

  constructor(decorators: SettingDecorator[]) {
    this.settings = decorators.reduce(
      (acc, decorator) => ({ ...acc, ...decorator.decorate() }),
      { ...DefaultSettingsHandlerImpl.defaultSettings }
    );
  }

  handle(): ISettings {
    return this.settings;
  }
}
