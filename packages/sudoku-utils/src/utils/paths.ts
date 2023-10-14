import type {
  Position,
  PathType,
  Path,
  Color,
  Form,
  Fill,
  Digit,
  CellValues,
  EditorHistoryStep
} from '@octopuzzles/models';
import { Digits } from '@octopuzzles/models';
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
        let alternateForm: Form = 'Square';
        if (path.type === 'Between') {
          alternateForm = 'Round';
        } else if (path.type === 'Lockout') {
          alternateForm = 'Diamond';
        }
        drawPaths.push({
          type: undefined,
          arrow: false,
          color: path.color ?? defaultSettings.color,
          fill: 'Hollow',
          form: path.form ?? alternateForm,
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

/*Checks the inputted digits against the standard constraint logic for the path
and returns any cells that have errors*/
export function verifyPath(path: Path, solution: CellValues, clues: EditorHistoryStep): Position[] {
  let regionNos: Map<string, number> | null = null;

  let isValid = true;
  if (!(path.nonStandard ?? false)) {
    switch (path.type) {
      case 'Arrow': {
        let target: number | undefined = undefined;
        const position = path.positions[0];
        const pill = clues.paths.find(
          (l) =>
            l.type === 'Pill' &&
            l.positions.some((q) => q.row === position.row && q.column === position.column)
        );

        if (pill) {
          let t = '';
          if (
            deepCopy(pill.positions)
              .sort(comparePositions)
              .every((p) => {
                const cell = solution[p.row][p.column];
                if (cell.digits == null) {
                  return false;
                }

                t += cell.digits?.join('');

                return true;
              })
          ) {
            target = parseInt(t);
          }
        } else {
          target = solution[position.row][position.column].value;
        }
        if (target == null) {
          break;
        }

        let total = 0;

        if (
          path.positions.every((p, i) => {
            if (i === 0) return true;

            const value = solution[p.row][p.column].value;
            if (value != null) {
              total += value;
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
          const position = path.positions[n];
          const digits = solution[position.row][position.column].digits;
          if (digits != null) {
            if (
              prev != null &&
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
        const position1 = path.positions[0];
        const position2 = path.positions[path.positions.length - 1];
        const cell1 = solution[position1.row][position1.column];
        const cell2 = solution[position2.row][position2.column];

        if (cell1.value != null && cell2.value != null) {
          const min = cell1.value < cell2.value ? cell1.value : cell2.value;
          const max = cell1.value > cell2.value ? cell1.value : cell2.value;

          if (path.type === 'Lockout' && max - min < 4) {
            isValid = false;
          } else {
            isValid = path.positions.every((p, i) => {
              if (i === 0 || i === path.positions.length - 1) return true;

              const cell = solution[p.row][p.column];
              if (cell.digits == null) {
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
            if (cell.digits == null) return false;

            if (min == null || max == null) {
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
          if (min != null && max != null) {
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
          const position = path.positions[n];
          const cell = solution[position.row][position.column];
          if (cell.digits != null) {
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
          const position1 = path.positions[n];
          const position2 = path.positions[path.positions.length - n - 1];
          const cell1 = solution[position1.row][position1.column];
          const cell2 = solution[position2.row][position2.column];
          if (cell1.value != null && cell2.value != null && cell1.value !== cell2.value) {
            unmirrored.push(position1, position2);
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
          if (cell.digits != null) {
            if (cell.value != null) {
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
        if (regionNos == null) {
          regionNos = new Map<string, number>();
          clues.regions.forEach((r, n) => {
            if (r.type === 'Normal') {
              r.positions.forEach((p) => {
                regionNos?.set('R' + p.row + 'C' + p.column, n);
              });
            }
          });
        }

        let target: number | null = null;
        let prevRegionNo: number | undefined = undefined;
        let total = 0;
        let skip = false;
        for (let n = 0; n < path.positions.length; ++n) {
          const position = path.positions[n];
          const cell = solution[position.row][position.column];
          const regionNo = regionNos.get('R' + position.row + 'C' + position.column);
          if (regionNo !== prevRegionNo) {
            if (prevRegionNo != null) {
              if (!skip) {
                if (target == null) {
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
          if (cell.value == null) {
            skip = true;
          } else {
            total += cell.value;
          }
        }

        isValid = target == null || (!skip && total === target);
        break;
      }
      case 'ProductSum': {
        const position1 = path.positions[0];
        const position2 = path.positions[path.positions.length - 1];
        const cell1 = solution[position1.row][position1.column];
        const cell2 = solution[position2.row][position2.column];

        if (cell1.value != null && cell2.value != null) {
          const product = cell1.value * cell2.value;
          let total = 0;

          if (
            path.positions.every((p, i) => {
              if (i === 0 || i === path.positions.length - 1) return true;

              const cell = solution[p.row][p.column];
              if (cell.value != null) {
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
          const position1 = path.positions[i - 2];
          const position2 = path.positions[i - 1];
          const position3 = path.positions[i];
          const cell1 = solution[position1.row][position1.column];
          const cell2 = solution[position2.row][position2.column];
          const cell3 = solution[position3.row][position3.column];
          if (cell1.digits != null && cell2.digits != null && cell3.digits != null) {
            const entropySets = [...cell1.digits, ...cell2.digits, ...cell3.digits].map((d) =>
              Math.ceil(Digits.indexOf(d) / 3)
            );
            if (!entropySets.includes(1) || !entropySets.includes(2) || !entropySets.includes(3)) {
              isValid = false;
              if (i - 2 > lastInvalidIndex) invalidCells.push(position1);
              if (i - 1 > lastInvalidIndex) invalidCells.push(position2);
              if (i > lastInvalidIndex) invalidCells.push(position3);
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
          if (cell.digits != null) {
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
          const position1 = path.positions[i - 1];
          const position2 = path.positions[i];
          const cell1 = solution[position1.row][position1.column];
          const cell2 = solution[position2.row][position2.column];
          if (cell1.digits != null && cell2.digits != null) {
            if (
              cell1.digits.some((d) =>
                cell2.digits?.some((e) => Digits.indexOf(d) % 2 === Digits.indexOf(e) % 2)
              )
            ) {
              isValid = false;
              if (i - 1 > lastInvalidIndex) invalidCells.push(position1);
              if (i > lastInvalidIndex) invalidCells.push(position2);
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
