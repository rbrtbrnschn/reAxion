import { ISettings } from '@reaxion/common';
import { SettingsManagerEvent } from '../../settings-manager';

export class SettingsManagerResponse<T> {
  public readonly key: string = 'SETTINGS_MANAGER_RESPONSE';
  public readonly id: string;
  constructor(
    public readonly state: ISettings,
    public readonly event: SettingsManagerEvent,
    public readonly payload: T
  ) {
    this.id = event + '_RESPONSE';
  }
}
export class EmptySettingsManagerResponse extends SettingsManagerResponse<undefined> {
  public readonly key = 'EMPTY_RESPONSE';
  constructor(state: ISettings, event: SettingsManagerEvent) {
    super(state, event, undefined);
  }
}

function getResponseId(event: SettingsManagerEvent) {
  return event + '_RESPONSE';
}

export function isSetColoringResponse(
  response: SettingsManagerResponse<unknown>
): response is SettingsManagerResponse<unknown> {
  return response.id === getResponseId(SettingsManagerEvent.SET_COLORING);
}

export function isSetDifficultyResponse(
  response: SettingsManagerResponse<unknown>
): response is SettingsManagerResponse<unknown> {
  return response.id === getResponseId(SettingsManagerEvent.SET_DIFFICULTY);
}
export function isSetUserIdResponse(
  response: SettingsManagerResponse<unknown>
): response is SettingsManagerResponse<unknown> {
  return response.id === getResponseId(SettingsManagerEvent.SET_USER_ID);
}
