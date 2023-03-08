import {
  ILoggerService,
  loggerService,
} from "../utils/loggerService/Logger.service";
import { ReactionBuilder } from "../utils/reaction/Reaction.builder";

export interface Injections {
  loggerService: ILoggerService;
  reactionBuilder: ReactionBuilder;
}
export const injections: Injections = {
  loggerService,
  reactionBuilder: new ReactionBuilder(),
};
