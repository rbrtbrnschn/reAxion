import { ISettings } from '@reaxion/common/interfaces';

export interface SettingDecorator {
  decorate: () => Partial<ISettings>;
}
