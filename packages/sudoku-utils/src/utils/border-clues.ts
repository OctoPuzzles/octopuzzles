import {
  Position,
  BorderClueType,
  Borderclue,
  Shape,
  Color,
  Digits,
  CellValues
} from '@octopuzzles/models';

export function emptyBorderClue(
  positions: [Position, Position],
  type?: BorderClueType
): Borderclue {
  return {
    type,
    positions,
    color: undefined,
    radius: undefined,
    text: undefined,
    nonStandard: undefined
  };
}

export function borderClueDefaults(type?: BorderClueType | 'CUSTOM' | null): {
  shape: Shape;
  color: Color | 'NONE';
  radius: number;
  text: string;
  nonStandard: boolean;
} {
  switch (type) {
    case 'KropkiWhite':
    case 'KropkiBlack':
      return {
        shape: 'Circle',
        color: type === 'KropkiWhite' ? 'White' : 'Black',
        radius: 10,
        text: '',
        nonStandard: false
      };
    case 'XvX':
    case 'XvV':
      return {
        shape: 'Circle',
        color: 'NONE',
        radius: 20,
        text: String(type)[3],
        nonStandard: false
      };
    case 'Inequality':
      return { shape: 'Circle', color: 'NONE', radius: 20, text: '<', nonStandard: false };
    case 'Quadruple':
      return { shape: 'Circle', color: 'White', radius: 20, text: '', nonStandard: false };
    case 'Border':
      return { shape: 'Line', color: 'Black', radius: 50, text: '', nonStandard: false };
    default:
      return { shape: 'Circle', color: 'NONE', radius: 10, text: '', nonStandard: false };
  }
}

export function getBorderCluesToDraw(clue: Borderclue): Borderclue[] {
  const defaultSettings = borderClueDefaults(clue.type);
  let text: string = clue.text ?? '';
  switch (clue.type) {
    case 'XvX':
      text = 'X';
      break;
    case 'XvV':
      text = 'V';
      break;
    case 'Inequality':
      if (clue.positions[0].column < clue.positions[1].column) {
        text = '\u003c';
      } else if (clue.positions[0].column > clue.positions[1].column) {
        text = '\u003e';
      } else if (clue.positions[0].row < clue.positions[1].row) {
        text = '\u2227';
      } else {
        text = '\u2228';
      }
      break;
  }
  return [
    {
      positions: clue.positions,
      type: clue.type,
      shape: clue.shape ?? defaultSettings.shape,
      color: clue.color ?? (defaultSettings.color !== 'NONE' ? defaultSettings.color : undefined),
      radius: clue.radius ?? defaultSettings.radius,
      text
    }
  ];
}

export function verifyBorderClue(borderclue: Borderclue, solution: CellValues): Position[] {
  let isValid = true;

  if (!(borderclue.nonStandard ?? false)) {
    if (borderclue.type === 'Quadruple') {
      if (borderclue.text) {
        const p = borderclue.positions[0];
        const q = borderclue.positions[1];
        const cells = [p, { row: p.row, column: q.column }, q, { row: q.row, column: p.column }];
        const digits: string[] = [];
        if (
          cells.every((pos) => {
            const cell = solution[pos.row][pos.column];
            if (!cell.digits) {
              return false;
            }
            digits.push(...cell.digits);
            return true;
          })
        ) {
          isValid = borderclue.text.split(',').every((v) => digits.includes(v));
          if (!isValid) {
            return cells;
          }
        }
      }
    } else {
      const p = borderclue.positions[0];
      const q = borderclue.positions[1];
      const a = solution[p.row][p.column];
      const b = solution[q.row][q.column];

      if (!a.digits || !b.digits) return [];

      if (borderclue.type === 'XvX' || borderclue.type === 'XvV') {
        const x = a.value;
        const y = b.value;
        if (x !== undefined && y !== undefined) {
          isValid = x + y === (borderclue.type === 'XvX' ? 10 : 5);
        }
      } else if (
        !a.digits.every(
          (v) =>
            !b.digits?.every((u) => {
              const x = Digits.indexOf(v);
              const y = Digits.indexOf(u);
              switch (borderclue.type) {
                case 'Inequality':
                  isValid = x < y;
                  break;
                case 'KropkiBlack':
                  isValid = x === 2 * y || y === 2 * x;
                  break;
                case 'KropkiWhite':
                  isValid = Math.abs(x - y) === 1;
                  break;
              }
            })
        )
      ) {
        isValid = false;
      }
    }
  }

  if (!isValid) {
    return borderclue.positions;
  } else {
    return [];
  }
}
