import { ISettings } from '@reaxion/common';
import { SettingDecorator } from './decorator.interface';

export class UserIdFromCookieDecorator implements SettingDecorator {
  getCookie(name: string): string | undefined {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    if (match) return match[2];
    return undefined;
  }
  decorate(): Partial<ISettings> {
    const userId = this.getCookie('userId');
    if (userId) {
      document.cookie =
        'userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return { userId };
    }
    return {};
  }
}
