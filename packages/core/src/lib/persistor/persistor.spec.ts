import { ConcretePersistorImpl } from './persistor';
import { LocalStoragePersistorImpl } from './strategies/local-storage.strategy';

describe('persitor', () => {
  const mockKey = 'foo';
  const mockValue = 'bar';
  let persistor: ConcretePersistorImpl;
  beforeEach(() => {
    persistor = new ConcretePersistorImpl();
    persistor.setStrategy(new LocalStoragePersistorImpl());
  });
  it('should set strategy', () => {
    persistor = new ConcretePersistorImpl();
    expect(persistor.strategy).toBeUndefined();
    persistor.setStrategy(new LocalStoragePersistorImpl());
    expect(persistor.strategy).toEqual(new LocalStoragePersistorImpl());
  });
  it('should throw no strategy set error', () => {
    persistor = new ConcretePersistorImpl();
    const shouldThrow = () => persistor.getItem(mockKey);
    expect(shouldThrow).toThrowError();
  });
  it('should get item', () => {
    localStorage.setItem(mockKey, mockValue);
    expect(persistor.getItem(mockKey)).toEqual(mockValue);
  });
  it('should set item', () => {
    persistor.setItem(mockKey, mockValue);
    expect(persistor.getItem(mockKey)).toEqual(mockValue);
  });
  it('should remove item', () => {
    persistor.setItem(mockKey, mockValue);
    expect(persistor.getItem(mockKey)).toEqual(mockValue);
    persistor.removeItem(mockKey);
    expect(persistor.getItem(mockKey)).toEqual(null);
  });
});
