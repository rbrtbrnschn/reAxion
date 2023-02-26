import {
  ILoggerService,
  loggerService,
} from "../utils/loggerService/Logger.service";

export interface Injections {
  loggerService: ILoggerService;
}
export const injections: Injections = {
  loggerService,
};
