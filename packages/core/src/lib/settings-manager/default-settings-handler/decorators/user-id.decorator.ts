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
    if (userId) return { userId };
    return {};
  }
}
