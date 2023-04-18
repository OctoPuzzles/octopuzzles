import type { Position, BorderClueType, Borderclue, Shape, Color } from '@octopuzzles/models';

export function emptyBorderClue(
  positions: [Position, Position],
  type?: BorderClueType
): Borderclue {
  return { type, positions, color: undefined, radius: undefined, text: undefined };
}

export function borderClueDefaults(type?: BorderClueType | 'CUSTOM' | null): {
  shape: Shape;
  color: Color | 'NONE';
  radius: number;
  text: string;
} {
  switch (type) {
    case 'KropkiWhite':
    case 'KropkiBlack':
      return {
        shape: 'Circle',
        color: type === 'KropkiWhite' ? 'White' : 'Black',
        radius: 10,
        text: ''
      };
    case 'XvX':
    case 'XvV':
      return { shape: 'Circle', color: 'NONE', radius: 20, text: String(type)[3] };
    case 'Inequality':
      return { shape: 'Circle', color: 'NONE', radius: 20, text: '<' };
    case 'Quadruple':
      return { shape: 'Circle', color: 'White', radius: 20, text: '' };
    case 'Border':
      return { shape: 'Line', color: 'Black', radius: 50, text: '' };
    default:
      return { shape: 'Circle', color: 'NONE', radius: 10, text: '' };
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
