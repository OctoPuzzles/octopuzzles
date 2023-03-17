import { CageType, Color, Extendedcage, Position } from '@octopuzzles/models';

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

export * from './topLeftPosition';
export * from './createOutlines';
