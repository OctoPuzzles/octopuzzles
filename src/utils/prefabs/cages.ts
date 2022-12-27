import type {
    CageType,
    Color,
    Extendedcage,
    Position
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