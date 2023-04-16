import type { Position, PathType, Path, Color, Form, Fill } from '@octopuzzles/models';

export function emptyPath(positions: Position[], type?: PathType): Path {
  return {
    type,
    positions,
    color: undefined,
    width: undefined,
    form: undefined,
    fill: undefined,
    arrow: undefined,
    uniqueDigits: undefined
  };
}

export function pathDefaults(type?: PathType | 'CUSTOM' | null): {
  color: Color;
  width: number;
  form: Form;
  fill: Fill;
  arrow: boolean;
  uniqueDigits: boolean;
} {
  switch (type) {
    case 'Arrow':
      return {
        color: 'Gray',
        width: 5,
        form: 'Round',
        fill: 'Solid',
        arrow: true,
        uniqueDigits: true
      };
    case 'Thermo':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 20,
        uniqueDigits: true
      };
    case 'Between':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 5,
        uniqueDigits: false
      };
    case 'Lockout':
      return {
        arrow: false,
        color: 'Blue',
        fill: 'Solid',
        form: 'Diamond',
        width: 5,
        uniqueDigits: false
      };
    case 'Renban':
      return {
        arrow: false,
        color: 'Purple',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: true
      };
    case 'Whisper':
      return {
        arrow: false,
        color: 'Green',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false
      };
    case 'Palindrome':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false
      };
    case 'AntiFactor':
      return {
        arrow: false,
        color: 'Yellow',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false
      };
    case 'EqualSum':
      return {
        arrow: false,
        color: 'Blue',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false
      };
    case 'ProductSum':
      return {
        arrow: false,
        color: 'Red',
        fill: 'Solid',
        form: 'Square',
        width: 13,
        uniqueDigits: false
      };
    case 'Entropic':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: 'Round',
        width: 15,
        uniqueDigits: false
      };
    case 'Odd':
    case 'Even':
      return {
        arrow: false,
        color: 'Gray',
        fill: 'Solid',
        form: type === 'Even' ? 'Square' : 'Round',
        width: 70,
        uniqueDigits: false
      };
    case 'Pill':
      return {
        color: 'Gray',
        width: 66,
        form: 'Round',
        fill: 'Hollow',
        arrow: false,
        uniqueDigits: false
      };
    default:
      return {
        color: 'Black',
        width: 10,
        form: 'Round',
        fill: 'Solid',
        arrow: false,
        uniqueDigits: false
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
