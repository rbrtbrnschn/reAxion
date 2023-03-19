import { IDifficulty } from '@reaxion/common/interfaces';

export class EasyDifficulty implements IDifficulty {
  public readonly id = 'EASY_DIFFICULTY';
  public readonly deviation = 500;
  public readonly maxFailedAttempts = 5;
  public readonly maxDuration = 3000;
}
export class MediumDifficulty implements IDifficulty {
  public readonly id = 'MEDIUM_DIFFICULTY';
  public readonly deviation = 300;
  public readonly maxFailedAttempts = 3;
  public readonly maxDuration = 2000;
}
export class HardDifficulty implements IDifficulty {
  public readonly id = 'HARD_DIFFICULTY';
  public readonly deviation = 100;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 1000;
}
export class ExtremeDifficulty implements IDifficulty {
  public readonly id = 'EXTREME_DIFFICULTY';
  public readonly deviation = 50;
  public readonly maxFailedAttempts = 1;
  public readonly maxDuration = 500;
}
