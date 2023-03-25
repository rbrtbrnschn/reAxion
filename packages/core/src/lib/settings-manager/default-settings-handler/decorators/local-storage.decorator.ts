import { Settings } from '../../../interfaces';
import { LocalStoragePersistorImpl } from '../../../persistor';
import { SettingDecorator } from './decorator.interface';

export class LocalStorageDecorator implements SettingDecorator {
  decorate(): Partial<Settings> {
    const settings = new LocalStoragePersistorImpl().getItem<Settings>(
      'settings'
    );
    if (settings === null) return {};
    return { ...settings };
  }
}
