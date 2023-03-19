import { GuessStatus, ReactionStatus } from '@reaxion/common/enums';
import { IReaction } from '@reaxion/common/interfaces';
import { v4 as uuid4 } from 'uuid';

export class ReactionBuilder {
  buildByDuration({ duration }: Pick<IReaction, 'duration'>): IReaction {
    return {
      duration,
      guesses: [],
      guessStatus: GuessStatus.IS_WAITING,
      reactionStatus: ReactionStatus.HAS_NOT_STARTED,
      isGuessed: false,
      id: uuid4(),
    };
  }
  buildWithRandomDuration(resolveDuration?: () => number) {
    const randomDuration = Math.ceil(
      resolveDuration?.() ?? Math.random() * 1000 * Math.ceil(Math.random() * 5)
    );
    return this.buildByDuration({ duration: randomDuration });
  }
}
