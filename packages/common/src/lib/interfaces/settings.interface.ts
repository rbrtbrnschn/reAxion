export interface ISettings {
  difficulty: IDifficulty;
  coloring: IColor;
  userId: string;
}

export interface IDifficulty {
  id: string;
  name: string;
  deviation: number;
  maxDuration: number;
  maxFailedAttempts: number;
}

export interface IColor {
  countdown: string;
  waiting: string;
  end: string;
}
