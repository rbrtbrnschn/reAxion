import { createStore, createTypedHooks } from "easy-peasy";
import { loggerService } from "../../utils/loggerService/Logger.service";
import { gameModel, GameModel } from "./models/game.model";
import { ReactionModel, reactionModel } from "./models/reaction.model";

interface GlobalStoreModelV2 {
  game: GameModel;
  reaction: ReactionModel;
}
const globalStoreModel: GlobalStoreModelV2 = {
  game: gameModel,
  reaction: reactionModel,
};

export const store = createStore<GlobalStoreModelV2>(globalStoreModel, {
  name: "Global Stor V2",
  injections: {
    loggerService,
  },
});

const typedHooks = createTypedHooks<GlobalStoreModelV2>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
