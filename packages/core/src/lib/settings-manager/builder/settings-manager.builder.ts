import { Settings } from '../../interfaces';
import {
  DefaultSettingsHandlerImpl,
  Middleware,
} from '../default-settings-handler';
import { SettingsManager } from '../settings-manager';

export class SettingsManagerBuilder {
  private middleware: Middleware<Settings>[] = [];

  withMiddleware(middleware: Middleware<Settings>[]): SettingsManagerBuilder {
    this.middleware = middleware;
    return this;
  }

  create(): SettingsManager {
    return new SettingsManager();
  }

  createWithInitialState(): SettingsManager {
    const initialState = new DefaultSettingsHandlerImpl(
      this.middleware
    ).handle();
    return new SettingsManager(initialState);
  }
}
