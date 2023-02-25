import { createStore, createTypedHooks } from "easy-peasy";
import { ReactionModel, reactionModel } from "./models/reaction.model";

export interface GlobalStoreModelV3 {
  reaction: ReactionModel;
}
const globalStoreModel: GlobalStoreModelV3 = {
  reaction: reactionModel,
};

export const store = createStore<GlobalStoreModelV3>(globalStoreModel, {
  name: "Global Store V3",
});

const typedHooks = createTypedHooks<GlobalStoreModelV3>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
