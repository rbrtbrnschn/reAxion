import { InvalidPermissionError } from './errors';
import { GameManager } from './game-manager';

/**
 * Function only fires if state.currentEvent is included in the whitelist.
 * @param events {string[]}
 * @returns
 */
type EventDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

export function HasEvent(events: string[]): EventDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: GameManager, ...args: any[]) {
      const whitelist = [...events];
      if (!whitelist.includes(this.getCurrentEvent()))
        throw new InvalidPermissionError(
          `${this.getCurrentEvent()}-${whitelist}`
        );

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
