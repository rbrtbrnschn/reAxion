import { v4 as uuid } from 'uuid';
import {
  DefaultSettingsHandlerImpl,
  SettingsManager,
  UserIdFromCookieDecorator,
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
        .withDecorators([])
        .createWithInitialState()
        .getState()
    ).toEqual(DefaultSettingsHandlerImpl.defaultSettings);
  });
  it('should create with default settings with decorators', () => {
    document.cookie = 'userId=' + mockUserId;
    expect(
      new SettingsManagerBuilder()
        .withDecorators([new UserIdFromCookieDecorator()])
        .createWithInitialState()
        .getState().userId
    ).toEqual(mockUserId);
  });
});
