import { createStore, createTypedHooks } from "easy-peasy";
import {
  ILoggerService,
  loggerService,
} from "../utils/loggerService/Logger.service";
import { ReactionModel, reactionModel } from "./models/reaction.model";

export interface GlobalStoreModelV3 {
  reaction: ReactionModel;
}
const globalStoreModel: GlobalStoreModelV3 = {
  reaction: reactionModel,
};
export interface InjectionV3 {
  loggerService: ILoggerService;
}
const injections: InjectionV3 = {
  loggerService,
};
export const store = createStore<GlobalStoreModelV3>(globalStoreModel, {
  name: "Global Store V3",
  injections,
});

const typedHooks = createTypedHooks<GlobalStoreModelV3>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
