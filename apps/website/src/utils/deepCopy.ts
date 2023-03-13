// Creates a deep copy of the object.
function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}

export default deepCopy;
