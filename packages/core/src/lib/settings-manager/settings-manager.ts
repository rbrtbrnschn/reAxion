import { IColor, IDifficulty, ISettings } from '@reaxion/common';
import { v4 as uuid, validate } from 'uuid';
import { DefaultColoring, EasyDifficulty } from '../game-manager';
import { ObserverSubject } from '../observer';

export const defaultSettings: ISettings = {
  coloring: new DefaultColoring(),
  difficulty: new EasyDifficulty(),
  userId: uuid(),
};
export class SettingsManager extends ObserverSubject {
  protected state: ISettings;
  constructor(initialState?: ISettings) {
    super();
    this.state = { ...defaultSettings, ...initialState };
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
  }
  setColoring(coloring: IColor): ISettings {
    this.setState({ coloring });
    return this.state;
  }
  setDifficulty(difficulty: IDifficulty): ISettings {
    this.setState({ difficulty });
    return this.state;
  }
  setUserId(userId: string): ISettings {
    if (!validate(userId) || userId.length !== 36)
      throw new UserIdIsInvalidUUIDError(userId);
    this.setState({ userId });
    return this.state;
  }
}

class UserIdIsInvalidUUIDError extends Error {
  constructor(userId: string) {
    super(`userId: '${userId}' is not a valid UUID(v4)`);
  }
}
