import {
  DefaultSettingsHandlerImpl,
  SettingDecorator,
} from '../default-settings-handler';
import { SettingsManager } from '../settings-manager';

export class SettingsManagerBuilder {
  private decorators: SettingDecorator[] = [];

  withDecorators(decorators: SettingDecorator[]): SettingsManagerBuilder {
    this.decorators = decorators;
    return this;
  }

  create(): SettingsManager {
    return new SettingsManager();
  }

  createWithInitialState(): SettingsManager {
    const initialState = new DefaultSettingsHandlerImpl(
      this.decorators
    ).handle();
    return new SettingsManager(initialState);
  }
}
