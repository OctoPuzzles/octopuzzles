import type { Color, Position, Region, RegionType } from '@octopuzzles/models';

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
