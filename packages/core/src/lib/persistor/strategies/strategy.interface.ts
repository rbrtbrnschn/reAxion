export interface PersistorStrategy {
  setItem(key: string, value: unknown): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
}
