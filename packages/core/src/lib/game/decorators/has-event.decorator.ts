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
    descriptor.value = function (...args: any[]) {
      const whitelist = [...events];
      if (
        //@ts-ignore
        !this.getCurrentGame()
          .getEvents()
          .some((e: string) => whitelist.includes(e))
      )
        return;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
