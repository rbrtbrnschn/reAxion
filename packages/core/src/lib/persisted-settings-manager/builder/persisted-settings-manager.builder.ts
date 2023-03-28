import { Settings } from '../../interfaces';
import { Middleware } from '../../middleware';
import { ConcretePersistorImpl, Persistor } from '../../persistor/persistor';
import { PersistorStrategy } from '../../persistor/strategies/strategy.interface';
import { SettingsManagerBuilder } from '../../settings-manager';
import { PersistedSettingsManagerDecorator } from '../persisted-settings-manager';

export class PersistedSettingsManagerBuilder {
  private middleware: Middleware<Settings>[];
  private persistor: Persistor;
  constructor() {
    /* Refactor to SST */
    /* SettingDecoratorHandler? */
    this.middleware = [];
    this.persistor = new ConcretePersistorImpl();
  }
  withMiddleware(middleware: Middleware<Settings>[]) {
    this.middleware = middleware;
    return this;
  }
  withPersistorStrategy(strategy: PersistorStrategy) {
    this.persistor.setStrategy(strategy);
    return this;
  }
  create(): PersistedSettingsManagerDecorator {
    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();

    return new PersistedSettingsManagerDecorator(
      new SettingsManagerBuilder().create(),
      this.persistor
    );
  }

  createWithInitialState(): PersistedSettingsManagerDecorator {
    if (!this.persistor.hasStrategy()) throw new PersistorHasNoStrategyError();

    return new PersistedSettingsManagerDecorator(
      new SettingsManagerBuilder()
        .withMiddleware(this.middleware)
        .createWithInitialState(),
      this.persistor
    );
  }
}

class PersistorHasNoStrategyError extends Error {
  constructor() {
    super('Persistor Has No Strategy.');
  }
}
