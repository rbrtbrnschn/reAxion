export function whenDebugging<T, K>(t: T, k: K) {
  const USING_DEBUG_MODE = process.env.REACT_APP_ENVIRONMENT === 'development';
  const message = `whenDebugging: Using '${t}' over '${k}'`;
  USING_DEBUG_MODE && console.debug(message);

  return USING_DEBUG_MODE ? t : k;
}
