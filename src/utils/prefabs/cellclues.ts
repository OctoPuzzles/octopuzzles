import type {
    Cellclue,
    CellClueLocation,
    CellClueSize,
    CellClueType,
    Color,
    Position,
    Rotation,
    SymbolType
  } from '$models/Sudoku';
  
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