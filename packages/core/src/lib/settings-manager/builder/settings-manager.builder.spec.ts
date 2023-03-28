import { v4 as uuid } from 'uuid';
import {
  DefaultSettingsHandlerImpl,
  SettingsManager,
  UserIdFromCookieMiddleware,
} from '..';
import { SettingsManagerBuilder } from './settings-manager.builder';

describe('Settings Manager Builder', () => {
  const mockUserId = uuid();
  it('should create', () => {
    expect(new SettingsManagerBuilder().create()).toEqual(
      new SettingsManager()
    );
  });
  it('should create with default settings with no decorators', () => {
    expect(
      new SettingsManagerBuilder()
        .withMiddleware([])
        .createWithInitialState()
        .getState()
    ).toEqual(DefaultSettingsHandlerImpl.defaultSettings);
  });
  it('should create with default settings with decorators', () => {
    document.cookie = 'userId=' + mockUserId;
    expect(
      new SettingsManagerBuilder()
        .withMiddleware([UserIdFromCookieMiddleware])
        .createWithInitialState()
        .getState().userId
    ).toEqual(mockUserId);
  });
});
