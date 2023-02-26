import { GuessStatus } from "../../interfaces/v2/guess.interface";
import { ReactionStatus } from "../../interfaces/v2/reaction.interface";
import { IReaction } from "../../store/v3/models/reaction.model";
import { Reaction } from "./Reaction";

export class ReactionBuilder {
  buildByDuration({ duration }: Pick<IReaction, "duration">) {
    return new Reaction({
      duration,
      guesses: [],
      guessStatus: GuessStatus.IS_WAITING,
      reactionStatus: ReactionStatus.HAS_NOT_STARTED,
      isGuessed: false,
    });
  }
  buildWithRandomDuration(resolveDuration?: () => number) {
    const randomDuration = Math.ceil(
      resolveDuration?.() ?? Math.random() * 1000 * Math.ceil(Math.random() * 5)
    );
    return this.buildByDuration({ duration: randomDuration });
  }
}
