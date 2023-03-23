import { ISettings } from '@reaxion/common';
import { LocalStoragePersistorImpl } from '../../../persistor';
import { SettingDecorator } from './decorator.interface';

export class LocalStorageDecorator implements SettingDecorator {
  decorate(): Partial<ISettings> {
    const settings = new LocalStoragePersistorImpl().getItem<ISettings>(
      'settings'
    );
    if (settings === null) return {};
    return { ...settings };
  }
}
