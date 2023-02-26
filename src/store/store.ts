import { createStore, createTypedHooks } from "easy-peasy";
import { injections } from "./injections";
import { GameModel, gameModel } from "./models/game.model";
import { ReactionModel, reactionModel } from "./models/reaction.model";

export interface StoreModel {
  reaction: ReactionModel;
  game: GameModel;
}
const globalStoreModel: StoreModel = {
  reaction: reactionModel,
  game: gameModel,
};

export const store = createStore<StoreModel>(globalStoreModel, {
  name: "Global Store",
  injections,
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
