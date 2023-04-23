import {
  Position,
  PathType,
  Path,
  Color,
  Form,
  Fill,
  Digits,
  Digit,
  CellValues,
  EditorHistoryStep
} from '@octopuzzles/models';
import { deepCopy } from '@octopuzzles/utils';
import { comparePositions } from './killer-cages';

export function emptyPath(positions: Position[], type?: PathType): Path {
  return {
    type,
    positions,
    color: undefined,
    width: undefined,
    form: undefined,
    fill: undefined,
    arrow: undefined,
    uniqueDigits: undefined,
    nonStandard: undefined
  };
}

export function pathDefaults(type?: PathType | 'CUSTOM' | null): {
  color: Color;
  width: number;
  form: Form;
  fill: Fill;
  arrow: boolean;
  uniqueDigits: boolean;
  nonStandard: boolean;
} {
  switch (type) {
    case 'Arrow':
      return {
        color: 'Gray',
        width: 5,
        form: 'Round',
        fill: 'Solid',
        arrow: true,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Thermo':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 20,
        uniqueDigits: true,
        nonStandard: false
      };
    case 'Between':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 5,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Lockout':
      return {
        arrow: false,
        color: 'Blue',
        fill: 'Solid',
        form: 'Diamond',
        width: 5,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Renban':
      return {
        arrow: false,
        color: 'Purple',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: true,
        nonStandard: false
      };
    case 'Whisper':
    case 'DutchWhisper':
      return {
        arrow: false,
        color: type === 'DutchWhisper' ? 'Orange' : 'Green',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Palindrome':
    case 'Parity':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'AntiFactor':
      return {
        arrow: false,
        color: 'Yellow',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'EqualSum':
      return {
        arrow: false,
        color: 'Blue',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'ProductSum':
      return {
        arrow: false,
        color: 'Red',
        fill: 'Solid',
        form: 'Square',
        width: 13,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Entropic':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Odd':
    case 'Even':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: type === 'Even' ? 'Square' : 'Round',
        width: 70,
        uniqueDigits: false,
        nonStandard: false
      };
    case 'Pill':
      return {
        color: 'Gray',
        width: 66,
        form: 'Round',
        fill: 'Hollow',
        arrow: false,
        uniqueDigits: false,
        nonStandard: false
      };
    default:
      return {
        color: 'Black',
        width: 10,
        form: 'Round',
        fill: 'Solid',
        arrow: false,
        uniqueDigits: false,
        nonStandard: false
      };
  }
}

export function getPathsToDraw(path: Path): Path[] {
  const defaultSettings = pathDefaults(path.type);

  const drawPaths: Path[] = [
    {
      positions: path.positions,
      type: path.type,
      color: path.color ?? defaultSettings.color,
      width: path.width ?? defaultSettings.width,
      form: path.form ?? defaultSettings.form,
      fill: path.fill ?? defaultSettings.fill,
      arrow: path.arrow ?? defaultSettings.arrow,
      uniqueDigits: undefined
    }
  ];
  switch (path.type) {
    case 'Arrow': {
      drawPaths.push(
        ...getPathsToDraw({
          ...emptyPath([path.positions[0]], 'Pill'),
          color: path.color,
          form: path.form
        })
      );
      break;
    }
    case 'Thermo': {
      drawPaths.push({
        type: undefined,
        arrow: path.arrow ?? defaultSettings.arrow,
        color: path.color ?? defaultSettings.color,
        fill: path.fill ?? defaultSettings.fill,
        form: path.form ?? defaultSettings.form,
        positions: [path.positions[0]],
        width: 66,
        uniqueDigits: undefined
      });
      break;
    }
    case 'Between':
    case 'Lockout':
    case 'ProductSum': {
      const firstPosition = path.positions[0];
      const lastPosition = path.positions[path.positions.length - 1];

      for (const bulbPosition of [firstPosition, lastPosition]) {
        drawPaths.push({
          type: undefined,
          arrow: false,
          color: path.color ?? defaultSettings.color,
          fill: 'Hollow',
          form:
            path.form ??
            (path.type === 'Between' ? 'Round' : path.type === 'Lockout' ? 'Diamond' : 'Square'),
          positions: [bulbPosition],
          width: path.type === 'ProductSum' ? 70 : 81,
          uniqueDigits: undefined
        });
      }
      break;
    }
  }

  return drawPaths;
}

export function verifyPath(path: Path, solution: CellValues, clues: EditorHistoryStep): Position[] {
  let regionNos: Map<string, number> | null = null;

  let isValid = true;
  if (!(path.nonStandard ?? false)) {
    switch (path.type) {
      case 'Arrow': {
        let target: number | undefined = undefined;
        const p = path.positions[0];
        const pill = clues.paths.find(
          (l) =>
            l.type === 'Pill' && l.positions.some((q) => q.row === p.row && q.column === p.column)
        );

        if (pill) {
          let t = '';
          if (
            deepCopy(pill.positions)
              .sort(comparePositions)
              .every((p) => {
                const cell = solution[p.row][p.column];
                if (!cell.digits || (cell.modifiers?.includes('SCell') && cell.digits.length < 2)) {
                  return false;
                }

                t += cell.digits?.join('');

                return true;
              })
          ) {
            target = parseInt(t);
          }
        } else {
          target = solution[p.row][p.column].value;
        }
        if (target === undefined) {
          break;
        }

        let total = 0;

        if (
          path.positions.every((p, i) => {
            if (i === 0) return true;

            const v = solution[p.row][p.column].value;
            if (v !== undefined) {
              total += v;
              return true;
            } else {
              return false;
            }
          })
        ) {
          isValid = total === target;
        }

        if (!isValid && pill) {
          return [...pill.positions, ...path.positions.filter((_, i) => i !== 0)];
        }

        break;
      }
      case 'Thermo': {
        let prev: Digit | null = null;

        for (let n = 0; n < path.positions.length; ++n) {
          const p = path.positions[n];
          const digits = solution[p.row][p.column].digits;
          if (digits) {
            if (
              prev !== null &&
              digits.some((d) => Digits.indexOf(d) <= Digits.indexOf(prev as Digit))
            ) {
              isValid = false;
              break;
            }

            prev = digits[digits.length - 1];
          }
        }
        break;
      }
      case 'Between':
      case 'Lockout': {
        const p = path.positions[0];
        const q = path.positions[path.positions.length - 1];
        const a = solution[p.row][p.column];
        const b = solution[q.row][q.column];

        if (a.value !== undefined && b.value !== undefined) {
          const min = a.value < b.value ? a.value : b.value;
          const max = a.value > b.value ? a.value : b.value;

          if (path.type === 'Lockout' && max - min < 4) {
            isValid = false;
          } else {
            isValid = path.positions.every((p, i) => {
              if (i === 0 || i === path.positions.length - 1) return true;

              const cell = solution[p.row][p.column];
              if (!cell.digits) {
                return true;
              }

              if (path.type === 'Lockout') {
                return cell.digits.every((d) => Digits.indexOf(d) < min || Digits.indexOf(d) > max);
              } else {
                return cell.digits.every((d) => Digits.indexOf(d) > min && Digits.indexOf(d) < max);
              }
            });
          }
        }
        break;
      }
      case 'Renban': {
        let min: number | undefined = undefined;
        let max: number | undefined = undefined;
        let count = 0;
        if (
          path.positions.every((p) => {
            const cell = solution[p.row][p.column];
            if (!cell.digits || (cell.modifiers?.includes('SCell') && cell.digits.length < 2))
              return false;

            if (min === undefined || max === undefined) {
              min = Digits.indexOf(cell.digits[0]);
              max = Digits.indexOf(cell.digits[cell.digits.length - 1]);
            } else {
              min = Math.min(Digits.indexOf(cell.digits[0]), min);
              max = Math.max(Digits.indexOf(cell.digits[cell.digits.length - 1]), max);
            }
            count += cell.digits.length;
            return true;
          })
        ) {
          if (min !== undefined && max !== undefined) {
            isValid = max - min < count;
          }
        }
        break;
      }
      case 'Whisper':
      case 'DutchWhisper': {
        const diff = path.type === 'DutchWhisper' ? 4 : 5;
        let prev: Digit[] = [];

        for (let n = 0; n < path.positions.length; ++n) {
          const p = path.positions[n];
          const cell = solution[p.row][p.column];
          if (cell.digits) {
            if (
              prev.length > 0 &&
              cell.digits.some((d) =>
                prev.some((e) => Math.abs(Digits.indexOf(d) - Digits.indexOf(e)) < diff)
              )
            ) {
              isValid = false;
              break;
            }

            prev = cell.digits;
          } else {
            prev = [];
          }
        }
        break;
      }
      case 'Palindrome': {
        const unmirrored: Position[] = [];
        for (let n = 0; n < Math.floor(path.positions.length / 2); ++n) {
          const p = path.positions[n];
          const q = path.positions[path.positions.length - n - 1];
          const a = solution[p.row][p.column];
          const b = solution[q.row][q.column];
          if (a.value !== undefined && b.value !== undefined && a.value !== b.value) {
            unmirrored.push(p, q);
          }
        }
        return unmirrored;
      }
      case 'AntiFactor': {
        const factor = path.positions.length;
        let total = 0;
        let count = 0;
        const invalidCells = path.positions.filter((p) => {
          const cell = solution[p.row][p.column];
          if (cell.digits) {
            if (cell.value !== undefined) {
              total += cell.value;
              ++count;
            }

            return cell.digits.some((d) => {
              const n = Digits.indexOf(d);
              return n !== 1 && (factor % n === 0 || n % factor === 0);
            });
          }

          return false;
        });

        if (count === path.positions.length) {
          isValid = total % factor === 0;
        }
        if (isValid) {
          return invalidCells;
        }
        break;
      }
      case 'EqualSum': {
        if (regionNos === null) {
          regionNos = new Map<string, number>();
          clues.regions.forEach((r, n) => {
            if (r.type === 'Normal') {
              r.positions.forEach((p) => {
                regionNos?.set('R' + p.row + 'C' + p.column, n);
              });
            }
          });
        }

        let target = NaN;
        let prevRegionNo: number | undefined = undefined;
        let total = 0;
        let skip = false;
        for (let n = 0; n < path.positions.length; ++n) {
          const p = path.positions[n];
          const cell = solution[p.row][p.column];
          const regionNo = regionNos.get('R' + p.row + 'C' + p.column);
          if (regionNo !== prevRegionNo) {
            if (prevRegionNo !== undefined) {
              if (!skip) {
                if (isNaN(target)) {
                  target = total;
                } else if (total !== target) {
                  break;
                }
              }
              total = 0;
              skip = false;
            }
            prevRegionNo = regionNo;
          } else if (skip) {
            continue;
          }
          if (cell.value === undefined) {
            skip = true;
          } else {
            total += cell.value;
          }
        }

        isValid = isNaN(target) || (!skip && total === target);
        break;
      }
      case 'ProductSum': {
        const p = path.positions[0];
        const q = path.positions[path.positions.length - 1];
        const a = solution[p.row][p.column];
        const b = solution[q.row][q.column];

        if (a.value !== undefined && b.value !== undefined) {
          const product = a.value * b.value;
          let total = 0;

          if (
            path.positions.every((p, i) => {
              if (i === 0 || i === path.positions.length - 1) return true;

              const cell = solution[p.row][p.column];
              if (cell.value !== undefined) {
                total += cell.value;
                return true;
              }

              return false;
            })
          ) {
            isValid = total === product;
          }
        }
        break;
      }
      case 'Entropic': {
        const invalidCells: Position[] = [];
        let lastInvalidIndex = -1;
        for (let i = 2; i < path.positions.length; ++i) {
          const p = path.positions[i - 2];
          const q = path.positions[i - 1];
          const r = path.positions[i];
          const u = solution[p.row][p.column];
          const v = solution[q.row][q.column];
          const w = solution[r.row][r.column];
          if (u.digits && v.digits && w.digits) {
            const entropySets = [...u.digits, ...v.digits, ...w.digits].map((d) =>
              Math.ceil(Digits.indexOf(d) / 3)
            );
            if (!entropySets.includes(1) || !entropySets.includes(2) || !entropySets.includes(3)) {
              isValid = false;
              if (i - 2 > lastInvalidIndex) invalidCells.push(p);
              if (i - 1 > lastInvalidIndex) invalidCells.push(q);
              if (i > lastInvalidIndex) invalidCells.push(r);
              lastInvalidIndex = i;
            }
          }
        }
        return invalidCells;
      }
      case 'Odd':
      case 'Even': {
        const invalidCells: Position[] = [];
        path.positions.forEach((p) => {
          const cell = solution[p.row][p.column];
          if (cell.digits) {
            cell.digits.some((d) => {
              if (Digits.indexOf(d) % 2 !== (path.type === 'Odd' ? 1 : 0)) {
                invalidCells.push(p);
              }
            });
          }
        });
        return invalidCells;
      }
      case 'Parity': {
        const invalidCells: Position[] = [];
        let lastInvalidIndex = -1;
        for (let i = 1; i < path.positions.length; ++i) {
          const p = path.positions[i - 1];
          const q = path.positions[i];
          const a = solution[p.row][p.column];
          const b = solution[q.row][q.column];
          if (a.digits && b.digits) {
            if (
              a.digits.some((d) =>
                b.digits?.some((e) => Digits.indexOf(d) % 2 === Digits.indexOf(e) % 2)
              )
            ) {
              isValid = false;
              if (i - 1 > lastInvalidIndex) invalidCells.push(p);
              if (i > lastInvalidIndex) invalidCells.push(q);
              lastInvalidIndex = i;
            }
          }
        }
        return invalidCells;
      }
    }
  }

  if (!isValid) {
    return path.positions;
  } else {
    return [];
  }
}
