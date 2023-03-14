/**
 * Sets state.currentEvent
 * @param eventName
 * @returns
 */
export function Event(eventName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      //@ts-ignore
      this.state.currentEvent = eventName;
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
