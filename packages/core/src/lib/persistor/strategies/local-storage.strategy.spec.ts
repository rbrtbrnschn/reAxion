import { LocalStoragePersistorImpl } from './local-storage.strategy';

describe('local storage persistor', () => {
  it('should getItem', () => {
    const mockKey = 'foo';
    const mockValue = 'bar';
    localStorage.setItem(mockKey, mockValue);

    expect(new LocalStoragePersistorImpl().getItem(mockKey)).toEqual(mockValue);
  });
  it('should setItem', () => {
    const mockKey = 'foo';
    const mockValue = 'bar';
    new LocalStoragePersistorImpl().setItem(mockKey, mockValue);

    expect(new LocalStoragePersistorImpl().getItem(mockKey)).toEqual(mockValue);
  });

  it('should remove Item', () => {
    const mockKey = 'foo';
    const mockValue = 'bar';
    new LocalStoragePersistorImpl().setItem(mockKey, mockValue);
    expect(new LocalStoragePersistorImpl().getItem(mockKey)).toEqual(mockValue);

    new LocalStoragePersistorImpl().removeItem(mockKey);
    expect(new LocalStoragePersistorImpl().getItem(mockKey)).toEqual(null);
  });
});
