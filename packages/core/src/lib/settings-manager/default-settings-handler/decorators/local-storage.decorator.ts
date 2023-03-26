import { Settings } from '../../../interfaces';
import { Middleware } from '../../../middleware';
import { LocalStoragePersistorImpl } from '../../../persistor';

export const LocalStorageMiddleware: Middleware<Settings> = (context, next) => {
  const settings = new LocalStoragePersistorImpl().getItem<Settings>(
    'settings'
  );
  if (settings) {
    context.coloring = settings.coloring;
    context.difficulty = settings.difficulty;
    context.userId = settings.userId;
    context.username = settings.username;
  }
  return next();
};
