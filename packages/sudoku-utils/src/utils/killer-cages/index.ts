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
  if (cage.nonStandard === true) {
    return [];
  }

  let isValid = true;

  switch (cage.type) {
    case 'Killer': {
      if (cage.text != null) {
        const target = parseFloat(cage.text);

        let total = 0;
        const incrementTotal = (position: Position): boolean => {
          const value = solution[position.row][position.column].value;
          if (value == null) {
            return false;
          }

          total += value;
          return true;
        };

        if (cage.positions.every(incrementTotal)) {
          isValid = total === target;
        }
      }
      break;
    }
    case 'LookAndSay': {
      if (cage.text != null) {
        const keys = cage.text.split('');

        const counts = new Map<string, number>();
        const incrementCounts = (position: Position): boolean => {
          const cell = solution[position.row][position.column];
          if (cell.digits == null) {
            return false;
          }

          cell.digits.forEach((digit) => {
            counts.set(digit, (counts.get(digit) ?? 0) + 1);
          });
          return true;
        };

        if (!cage.positions.every(incrementCounts)) {
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

  if (!isValid) {
    return cage.positions;
  } else {
    return [];
  }
}

export * from './createOutlines';
