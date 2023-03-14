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

export function Whitelist(events: string[]): EventDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const whitelist = [...events];
      //@ts-ignore
      if (!whitelist.includes(this.state.currentEvent)) return;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
