import { PersistorStrategy } from './strategy.interface';

export class LocalStoragePersistorImpl implements PersistorStrategy {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      const parsedItem = JSON.parse(item);
      return parsedItem as T;
    } catch (e) {
      return item as T;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
