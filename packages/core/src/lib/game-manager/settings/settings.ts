import { IDifficulty, ISettings } from './settings.interface';

export class Settings implements ISettings {
  constructor(public difficulty: IDifficulty) {}
  public getDifficulty(): IDifficulty {
    return this.difficulty;
  }
  public setDifficulty(difficulty: IDifficulty): ISettings {
    this.difficulty = difficulty;
    return this;
  }
}
