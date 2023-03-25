import { validate } from 'uuid';
import {
  EmptySettingsManagerResponse,
  SettingsManagerResponse,
} from '../game-manager';
import { Coloring, Settings } from '../interfaces';
import { ObserverSubject } from '../observer';
import { DefaultSettingsHandlerImpl } from './default-settings-handler';
import { DifficultyStrategy } from './modules';

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
  protected state: Settings;
  constructor(initialState?: Settings) {
    super();
    this.state = {
      ...DefaultSettingsHandlerImpl.defaultSettings,
      ...initialState,
    };
  }

  /* Getters */
  getState(): Settings {
    return this.state;
  }
  getColoring(): Coloring {
    return this.state.coloring;
  }
  getDifficulty(): DifficultyStrategy {
    return this.state.difficulty;
  }
  getUserId(): string {
    return this.state.userId;
  }
  getUsername(): string {
    return this.state.username;
  }

  /* Setters */
  setState(state: Partial<Settings>) {
    this.state = { ...this.getState(), ...state };
    this.notify(
      SettingsManagerEvent.SET_STATE,
      new EmptySettingsManagerResponse(
        this.getState(),
        SettingsManagerEvent.SET_STATE
      )
    );
  }
  setColoring(coloring: Coloring): Settings {
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
  setDifficulty(difficulty: DifficultyStrategy): Settings {
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
  setUserId(userId: string): Settings {
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
  setUsername(username: string): Settings {
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
