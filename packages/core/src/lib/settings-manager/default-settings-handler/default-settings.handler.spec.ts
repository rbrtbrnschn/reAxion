import { v4 as uuid } from 'uuid';
import { UserIdFromCookieDecorator } from './decorators/user-id.decorator';
import { DefaultSettingsHandlerImpl } from './default-settings.handler';

describe('Default Settings Handler', () => {
  it('should access static defaults', () => {
    expect(DefaultSettingsHandlerImpl.defaultSettings).toBeDefined();
  });
  it('should handle userIdDecorator', () => {
    const mockUserId = uuid();
    document.cookie = 'userId=' + mockUserId;
    const myDefaultSettings = new DefaultSettingsHandlerImpl([
      new UserIdFromCookieDecorator(),
    ]).handle();
    expect(myDefaultSettings.userId).toEqual(mockUserId);
  });
});
