import { Settings } from '../../../interfaces';
import { Middleware } from '../../../middleware';
import { LocalStoragePersistorImpl } from '../../../persistor';

export const LocalStorageMiddleware: Middleware<Settings> = (context, next) => {
  const settings = new LocalStoragePersistorImpl().getItem<Settings>(
    'settings'
  );
  if (settings) {
    Object.entries(settings).forEach(([key, value]) => {
      if (!value) return;
      context[key as keyof Settings] = value;
    });
  }
  return next();
};
