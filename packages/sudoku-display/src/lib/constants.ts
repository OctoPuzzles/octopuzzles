import type { Rotation, SymbolType } from '@octopuzzles/models';
import DiagonalNorthWestToSouthEast from './symbols/DiagonalNorthWestToSouthEast.svelte';
import Arrow from './symbols/Arrow.svelte';
import SmallArrow from './symbols/SmallArrow.svelte';
import Arrowhead from './symbols/Arrowhead.svelte';
import InvertedArrowhead from './symbols/InvertedArrowhead.svelte';

export const symbolsMap: Record<SymbolType, typeof DiagonalNorthWestToSouthEast> = {
  Diagonal: DiagonalNorthWestToSouthEast,
  Arrow: Arrow,
  SmallArrow: SmallArrow,
  Arrowhead: Arrowhead,
  InvertedArrowhead: InvertedArrowhead
};

export const rotationsToDegree: Record<Rotation, number> = {
  North: 0,
  NorthEast: 45,
  East: 90,
  SouthEast: 135,
  South: 180,
  SouthWest: 225,
  West: 270,
  NorthWest: 315
};
