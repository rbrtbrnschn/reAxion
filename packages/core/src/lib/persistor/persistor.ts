import { PersistorStrategy } from './strategies/strategy.interface';

export interface Persistor extends PersistorStrategy {
  setStrategy(strategy: PersistorStrategy): void;
  hasStrategy(): boolean;
  strategy: PersistorStrategy | undefined;
}

export class ConcretePersistorImpl implements Persistor {
  strategy: PersistorStrategy | undefined;

  setStrategy(strategy: PersistorStrategy): void {
    this.strategy = strategy;
  }
  hasStrategy(): boolean {
    return !!this.strategy;
  }

  setItem(key: string, value: unknown): void {
    if (!this.strategy) throw new NoStrategySetError();
    return this.strategy?.setItem(key, value);
  }
  getItem<T>(key: string): T | null {
    if (!this.strategy) throw new NoStrategySetError();
    return this.strategy.getItem(key);
  }
  removeItem(key: string): void {
    if (!this.strategy) throw new NoStrategySetError();
    return this.strategy.removeItem(key);
  }
}
class NoStrategySetError extends Error {
  constructor() {
    super('No Strategy Set.');
  }
}
