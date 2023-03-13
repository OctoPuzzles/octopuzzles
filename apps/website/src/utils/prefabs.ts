import type {
  Borderclue,
  BorderClueType,
  CageType,
  Cellclue,
  CellClueLocation,
  CellClueSize,
  CellClueType,
  Color,
  Extendedcage,
  Fill,
  Form,
  Path,
  PathType,
  Position,
  Region,
  RegionType,
  Rotation,
  Shape,
  SymbolType
} from '$models/Sudoku';

export function emptyCage(positions: Position[], type?: CageType): Extendedcage {
  return { type, positions, text: undefined, color: undefined, uniqueDigits: undefined };
}

export function cageDefaults(type: CageType | null | 'CUSTOM'): {
  text: string;
  color: Color;
  uniqueDigits: boolean;
} {
  return { text: '', color: 'Black', uniqueDigits: type === 'Killer' };
}

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

export function emptyCellClue(position: Position, type?: CellClueType): Cellclue {
  return {
    type,
    position: position,
    location: undefined,
    text: undefined,
    size: undefined,
    symbol: undefined,
    rotation: undefined,
    color: undefined
  };
}

export function cellClueDefaults(type?: CellClueType | 'CUSTOM' | null): {
  text: string;
  location: CellClueLocation;
  size: CellClueSize;
  symbol: SymbolType | 'NONE';
  rotation: Rotation;
  color: Color;
} {
  switch (type) {
    case 'LittleKillerNW':
    case 'LittleKillerNE':
    case 'LittleKillerSE':
    case 'LittleKillerSW':
    case 'Sandwich':
    case 'Skyscraper':
    case 'XSum':
    case 'NumberedRoom':
      return {
        text: '',
        location: 'Center',
        size: 'Medium',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Black'
      };
    case 'Maximum':
    case 'Minimum':
      return {
        text: '',
        location: 'Center',
        size: 'Small',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Gray'
      };
    default:
      return {
        text: '',
        location: 'TopLeft',
        size: 'Small',
        symbol: 'NONE',
        rotation: 'NorthWest',
        color: 'Black'
      };
  }
}

export function getCellCluesToDraw(clue: Cellclue): Cellclue[] {
  const defaultSettings = cellClueDefaults(clue.type);

  const drawClues: Cellclue[] = [
    {
      position: clue.position,
      type: clue.type,
      text: clue.text ?? defaultSettings.text,
      location: clue.location ?? defaultSettings.location,
      size: clue.size ?? defaultSettings.size,
      symbol:
        clue.symbol ?? (defaultSettings.symbol !== 'NONE' ? defaultSettings.symbol : undefined),
      rotation: clue.rotation ?? defaultSettings.rotation,
      color: clue.color ?? defaultSettings.color
    }
  ];
  switch (clue.type) {
    case 'Maximum':
    case 'Minimum': {
      const partial: Cellclue = {
        position: clue.position,
        type: undefined,
        text: undefined,
        location: undefined,
        size: undefined,
        symbol: clue.type === 'Minimum' ? 'InvertedArrowhead' : 'Arrowhead',
        color: clue.color ?? defaultSettings.color
      };
      drawClues.push({ ...partial, rotation: 'North' });
      drawClues.push({ ...partial, rotation: 'East' });
      drawClues.push({ ...partial, rotation: 'South' });
      drawClues.push({ ...partial, rotation: 'West' });
      break;
    }
    case 'LittleKillerNW': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'NorthWest',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerNE': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'NorthEast',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerSE': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'SouthEast',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
    case 'LittleKillerSW': {
      drawClues.push({
        position: clue.position,
        type: undefined,
        text: undefined,
        size: undefined,
        location: undefined,
        symbol: 'SmallArrow',
        rotation: 'SouthWest',
        color: clue.color ?? defaultSettings.color
      });
      break;
    }
  }

  return drawClues;
}

export function emptyRegion(positions: Position[], type?: RegionType): Region {
  return { type, positions, borders: undefined, color: undefined };
}

export function regionDefaults(
  type?: RegionType | 'CUSTOM' | null,
  nonstandard = false
): {
  borders: boolean;
  color: Color | 'NONE';
  uniqueDigits: boolean;
} {
  switch (type) {
    case 'Normal':
      return {
        borders: true,
        color: 'NONE',
        uniqueDigits: !nonstandard
      };
    case 'Clone':
      return {
        borders: false,
        color: 'LightGray',
        uniqueDigits: false
      };
    default:
      return {
        borders: false,
        color: 'Gray',
        uniqueDigits: type === 'Extra' || type === 'MagicSquare'
      };
  }
}

export function getRegionsToDraw(region: Region): Region[] {
  const defaultSettings = regionDefaults(region.type);
  return [
    {
      positions: region.positions,
      type: region.type,
      borders: region.borders ?? defaultSettings.borders,
      color: region.color ?? (defaultSettings.color !== 'NONE' ? defaultSettings.color : undefined),
      uniqueDigits: undefined
    }
  ];
}
