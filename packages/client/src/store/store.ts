import { createStore, createTypedHooks, persist } from "easy-peasy";
import { whenDebugging } from "../utils/whenDebugging";
import { injections } from "./injections";
import { GameModel, gameModel, gameModelV2, GameModelV2 } from "./models/game.model";
import { ReactionModel, reactionModelV2 } from "./models/reaction.model";

export interface StoreModel {
  reaction: ReactionModel;
  game: GameModelV2;
}
const globalStoreModel: StoreModel = {
  reaction: reactionModelV2,
  game: gameModelV2,
};

export const store = createStore<StoreModel>(
persist(
    globalStoreModel, 
    {
    storage: whenDebugging("sessionStorage", "localStorage"),
  }
  ),
  {
    name: "Global Store",
    injections,
  }
);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
