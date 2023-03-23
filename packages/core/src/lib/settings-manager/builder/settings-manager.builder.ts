import {
  DefaultSettingsHandlerImpl,
  SettingDecorator,
  UserIdFromCookieDecorator,
} from '../default-settings-handler';
import { SettingsManager } from '../settings-manager';

export class SettingsManagerBuilder {
  decorators: SettingDecorator[];
  constructor() {
    this.decorators = [new UserIdFromCookieDecorator()];
  }

  withDecorators(decorators: SettingDecorator[]): SettingsManagerBuilder {
    this.decorators = decorators;
    return this;
  }

  create(): SettingsManager {
    return new SettingsManager();
  }

  createWithDefaultSettings(): SettingsManager {
    const defaultSettings = new DefaultSettingsHandlerImpl(
      this.decorators
    ).handle();
    return new SettingsManager(defaultSettings);
  }
}
