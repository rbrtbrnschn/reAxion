import { DifficultyStrategy } from '../settings-manager';

export interface Settings {
  difficulty: DifficultyStrategy;
  coloring: Coloring;
  userId: string;
  username: string;
}

export interface Coloring {
  countdown: string;
  waiting: string;
  end: string;
}
