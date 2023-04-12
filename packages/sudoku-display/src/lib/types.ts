import type { Position } from '@octopuzzles/models';

export type OnClickCellHandler = (cell: Position, metaButtonClicked: boolean) => void;
export type OnEnterCellHandler = (cell: Position, metaButtonClicked: boolean) => void;

export type HitboxType = 'corner' | 'border' | 'center';
export type OnMouseDownHitboxHandler = (type: HitboxType, position: Position) => void;
export type OnMouseEnterHitboxHandler = (type: HitboxType, position: Position) => void;
