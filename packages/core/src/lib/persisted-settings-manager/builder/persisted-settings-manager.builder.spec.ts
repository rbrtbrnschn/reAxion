import { v4 as uuid } from 'uuid';
import { Settings } from '../../interfaces';
import { LocalStoragePersistorImpl } from '../../persistor/strategies/local-storage.strategy';
import { UserIdFromCookieMiddleware } from '../../settings-manager/default-settings-handler/decorators/user-id.middleware';
import { PersistedSettingsManagerBuilder } from './persisted-settings-manager.builder';

describe('persisted settings manager builder', () => {
  const mockUserId = uuid();
  beforeEach(() => {
    new LocalStoragePersistorImpl().removeItem('settings');
  });
  it('should create', () => {
    const settingsManager = new PersistedSettingsManagerBuilder()
      .withPersistorStrategy(new LocalStoragePersistorImpl())
      .create();
    settingsManager.setUserId(mockUserId);

    expect(
      new LocalStoragePersistorImpl().getItem<Settings>('settings')?.userId
    ).toEqual(mockUserId);
  });

  it('should create with initial state', () => {
    document.cookie = 'userId=' + mockUserId;
    const settingsManager = new PersistedSettingsManagerBuilder()
      .withPersistorStrategy(new LocalStoragePersistorImpl())
      .withMiddleware([UserIdFromCookieMiddleware])
      .createWithInitialState();

    expect(settingsManager.getUserId()).toEqual(mockUserId);
  });
});
