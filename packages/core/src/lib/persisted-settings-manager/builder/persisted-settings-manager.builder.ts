import { ConcretePersistorImpl, Persistor } from '../../persistor/persistor';
import { PersistorStrategy } from '../../persistor/strategies/strategy.interface';
import { SettingsManagerBuilder } from '../../settings-manager';
import { SettingDecorator } from '../../settings-manager/default-settings-handler/decorators/decorator.interface';
import { PersistedSettingsManagerDecorator } from '../persisted-settings-manager';

export class PersistedSettingsManagerBuilder {
  private decorators: SettingDecorator[];
  private persistor: Persistor;
  constructor() {
    /* Refactor to SST */
    /* SettingDecoratorHandler? */
    this.decorators = [];
    this.persistor = new ConcretePersistorImpl();
  }
  withDecorators(decorators: SettingDecorator[]) {
    this.decorators = decorators;
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
        .withDecorators(this.decorators)
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
