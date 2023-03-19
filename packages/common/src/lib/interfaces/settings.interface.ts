export interface ISettings {
  difficulty: IDifficulty;
}
export interface IDifficulty {
  id: string;
  name: string;
  deviation: number;
  maxDuration: number;
  maxFailedAttempts: number;
}
