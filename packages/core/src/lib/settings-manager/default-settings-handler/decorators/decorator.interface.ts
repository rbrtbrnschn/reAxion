import { Settings } from '../../../interfaces';

export interface SettingDecorator {
  decorate: () => Partial<Settings>;
}
