import { IColor, IDifficulty, ISettings } from '@reaxion/common/interfaces';

export class Settings implements ISettings {
  constructor(public difficulty: IDifficulty, public coloring: IColor) {}
  public getDifficulty(): IDifficulty {
    return this.difficulty;
  }
  public setDifficulty(difficulty: IDifficulty): ISettings {
    this.difficulty = difficulty;
    return this;
  }
  public getColoring(): IColor {
    return this.coloring;
  }
  public setColoring(coloring: IColor): ISettings {
    this.coloring = coloring;
    return this;
  }
}
