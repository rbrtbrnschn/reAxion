import { IColor, IDifficulty, ISettings } from '@reaxion/common';
import { validate } from 'uuid';
import {
  EmptySettingsManagerResponse,
  SettingsManagerResponse,
} from '../game-manager';
import { ObserverSubject } from '../observer';
import { DefaultSettingsHandlerImpl } from './default-settings-handler';

export enum SettingsManagerEvent {
  SET_COLORING = 'SET_COLORING',
  SET_DIFFICULTY = 'SET_DIFFICULTY',
  SET_USER_ID = 'SET_USER_ID',
  SET_STATE = 'SET_STATE',
  SET_USERNAME = 'SET_USERNAME',
}
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
  getUsername(): string {
    return this.state.username;
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
    return this.getState();
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
    return this.getState();
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
    return this.getState();
  }
  setUsername(username: string): ISettings {
    if (!username) throw new InvalidUsernameError(username);
    if (username.length !== 3) throw new InvalidUsernameError(username);
    username.toLocaleLowerCase();

    this.setState({ username });
    this.notify(
      SettingsManagerEvent.SET_USERNAME,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_USERNAME
      )
    );
    return this.getState();
  }
}

class UserIdIsInvalidUUIDError extends Error {
  constructor(userId: string) {
    super(`userId: '${userId}' is not a valid UUID(v4)`);
  }
}
class InvalidUsernameError extends Error {
  constructor(username: unknown) {
    super(`Username: '${username}' is invalid.`);
  }
}
