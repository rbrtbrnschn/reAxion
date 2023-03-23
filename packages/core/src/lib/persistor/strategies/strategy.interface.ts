export interface PersistorStrategy {
  setItem(key: string, value: unknown): void;
  getItem<T>(key: string): T | null;
  removeItem(key: string): void;
}
