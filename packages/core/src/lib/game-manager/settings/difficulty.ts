import { IDifficulty } from '@reaxion/common/interfaces';

export class EasyDifficulty implements IDifficulty {
  public readonly id = 'EASY_DIFFICULTY';
  public readonly deviation = 500;
  public readonly maxFailedAttempts = 5;
  public readonly maxDuration = 3000;
  public readonly name = 'Easy';
}
export class MediumDifficulty implements IDifficulty {
  public readonly id = 'MEDIUM_DIFFICULTY';
  public readonly deviation = 300;
  public readonly maxFailedAttempts = 3;
  public readonly maxDuration = 2000;
  public readonly name = 'Medium';
}
export class HardDifficulty implements IDifficulty {
  public readonly id = 'HARD_DIFFICULTY';
  public readonly deviation = 100;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 1000;
  public readonly name = 'Hard';
}
export class ExtremeDifficulty implements IDifficulty {
  public readonly id = 'EXTREME_DIFFICULTY';
  public readonly deviation = 50;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 500;
  public readonly name = 'Insane';
}
export const difficulties: Record<string, IDifficulty> = {
  EASY_DIFFICULTY: new EasyDifficulty(),
  MEDIUM_DIFFICULTY: new MediumDifficulty(),
  HARD_DIFFICULTY: new HardDifficulty(),
  EXTREME_DIFFICULTY: new ExtremeDifficulty(),
};
