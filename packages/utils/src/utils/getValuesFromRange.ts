//Converts a string of the form "1-9" into an array of all chars in the range, e.g. [1,2,3,4,5,6,7,8,9]
//Can handle multiple different ranges in a single, separated by ";", "," or " "
//e.g. "0-3; A,B,C X-Z" -> [0,1,2,3,A,B,C,X,Y,Z]
export function getValuesFromRange(range: string): string[] {
  const values = range.split('');
  for (let n = values.length - 1; n >= 0; --n) {
    if (values[n] === ';' || values[n] === ',' || values[n] === ' ') {
      values.splice(n, 1);
      continue;
    }
    if (values[n] === '-') {
      const range: string[] = [];
      if (n > 0 && n < values.length - 1) {
        const start = values[n - 1].charCodeAt(0);
        const end = values[n + 1].charCodeAt(0);
        let char = start + 1;
        while (char < end) {
          range.push(String.fromCharCode(char));
          ++char;
        }
      }
      values.splice(n, 1, ...range);
    }
  }
  return values;
}
