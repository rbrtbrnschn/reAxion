import { IColor, IDifficulty, ISettings } from '@reaxion/common';
import { v4 as uuid, validate } from 'uuid';
import {
  EmptySettingsManagerResponse,
  SettingsManagerResponse,
} from '../game-manager';
import { ObserverSubject } from '../observer';
import { DefaultSettingsHandlerImpl } from './default-settings-handler';
import { DefaultColoring } from './modules/coloring';
import { EasyDifficulty } from './modules/difficulty';

export enum SettingsManagerEvent {
  SET_COLORING = 'SET_COLORING',
  SET_DIFFICULTY = 'SET_DIFFICULTY',
  SET_USER_ID = 'SET_USER_ID',
  SET_STATE = 'SET_STATE',
}
export const defaultSettings: ISettings = {
  coloring: new DefaultColoring(),
  difficulty: new EasyDifficulty(),
  userId: uuid(),
};
export class SettingsManager extends ObserverSubject<
  SettingsManagerResponse<unknown>
> {
  protected state: ISettings;
  constructor(initialState?: ISettings) {
    super();
    this.state = {
      ...DefaultSettingsHandlerImpl.defaultSettings,
      ...initialState,
    };
  }

  /* Getters */
  getState(): ISettings {
    return this.state;
  }
  getColoring(): IColor {
    return this.state.coloring;
  }
  getDifficulty(): IDifficulty {
    return this.state.difficulty;
  }
  getUserId(): string {
    return this.state.userId;
  }

  /* Setters */
  setState(state: Partial<ISettings>) {
    this.state = { ...this.getState(), ...state };
    this.notify(
      SettingsManagerEvent.SET_STATE,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_STATE
      )
    );
  }
  setColoring(coloring: IColor): ISettings {
    this.setState({ coloring });
    this.notify(
      SettingsManagerEvent.SET_COLORING,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_COLORING
      )
    );
    return this.state;
  }
  setDifficulty(difficulty: IDifficulty): ISettings {
    this.setState({ difficulty });
    this.notify(
      SettingsManagerEvent.SET_DIFFICULTY,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_DIFFICULTY
      )
    );
    return this.state;
  }
  setUserId(userId: string): ISettings {
    if (!validate(userId) || userId.length !== 36)
      throw new UserIdIsInvalidUUIDError(userId);
    this.setState({ userId });
    this.notify(
      SettingsManagerEvent.SET_USER_ID,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_USER_ID
      )
    );
    return this.state;
  }
}

class UserIdIsInvalidUUIDError extends Error {
  constructor(userId: string) {
    super(`userId: '${userId}' is not a valid UUID(v4)`);
  }
}
