// Creates a deep copy of the object.
export function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}
