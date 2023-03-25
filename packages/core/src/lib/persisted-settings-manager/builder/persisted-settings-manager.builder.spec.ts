import { v4 as uuid } from 'uuid';
import { Settings } from '../../interfaces';
import { LocalStoragePersistorImpl } from '../../persistor/strategies/local-storage.strategy';
import { UserIdFromCookieDecorator } from '../../settings-manager/default-settings-handler/decorators/user-id.decorator';
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
      .withDecorators([new UserIdFromCookieDecorator()])
      .createWithInitialState();

    expect(settingsManager.getUserId()).toEqual(mockUserId);
  });
});
