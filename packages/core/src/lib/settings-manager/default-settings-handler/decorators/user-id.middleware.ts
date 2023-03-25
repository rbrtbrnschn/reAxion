import { Settings } from '../../../interfaces';
import { Middleware } from '../default-settings.handler';

export const UserIdFromCookieMiddleware: Middleware<Settings> = (
  context,
  next
) => {
  const userId = getCookie('userId');
  if (userId) {
    removeCookie('userId');
    context.userId = userId;
  }
  return next();
  function removeCookie(name: string): void {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
  function getCookie(name: string): string | undefined {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    if (match) return match[2];
    return undefined;
  }
};
