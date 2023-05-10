import type { CageType, CellValues, Color, Extendedcage, Position } from '@octopuzzles/models';

export function emptyCage(positions: Position[], type?: CageType): Extendedcage {
  return {
    type,
    positions,
    text: undefined,
    color: undefined,
    uniqueDigits: undefined,
    nonStandard: undefined
  };
}

export function cageDefaults(type: CageType | null | 'CUSTOM'): {
  text: string;
  color: Color;
  uniqueDigits: boolean;
  nonStandard: boolean;
} {
  return { text: '', color: 'Black', uniqueDigits: type === 'Killer', nonStandard: false };
}

/*Checks the inputted digits against the standard constraint logic for the cage
and returns any cells that have errors*/
export function verifyCage(cage: Extendedcage, solution: CellValues): Position[] {
  let isValid = true;

  if (!(cage.nonStandard ?? false)) {
    switch (cage.type) {
      case 'Killer': {
        if (cage.text != null) {
          const target = parseFloat(cage.text);

          let total = 0;
          if (
            cage.positions.every((p) => {
              const value = solution[p.row][p.column].value;
              if (value != null) {
                total += value;
                return true;
              }
            })
          ) {
            isValid = total === target;
          }
        }
        break;
      }
      case 'LookAndSay': {
        if (cage.text != null) {
          const keys = cage.text.split('');
          const counts = new Map<string, number>();
          if (
            !cage.positions.every((p) => {
              const cell = solution[p.row][p.column];
              if (cell.digits != null) {
                cell.digits.forEach((d) => {
                  counts.set(d, (counts.get(d) ?? 0) + 1);
                });
                return true;
              }
            })
          ) {
            for (let n = 0; n < keys.length; n += 2) {
              const count = parseInt(keys[n]);
              const digit = keys[n];

              if (counts.get(digit) !== count) {
                isValid = false;
                break;
              }
            }
          }
        }
        break;
      }
    }
  }

  if (!isValid) {
    return cage.positions;
  } else {
    return [];
  }
}

export * from './topLeftPosition';
export * from './createOutlines';
