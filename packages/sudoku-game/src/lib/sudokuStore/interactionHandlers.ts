import type { Position } from '@octopuzzles/models';
import type { OnClickCellHandler, OnEnterCellHandler } from '@octopuzzles/sudoku-display';
import { isCommandKey, type ArrowDirection } from '@octopuzzles/utils';
import { get } from 'svelte/store';
import { gameHistory, selectedCells } from '.';

/**
 * Default action to do when user clicks on a cell
 */
export const handleClickCell: OnClickCellHandler = (cell, metaButtonClicked) => {
  if (!metaButtonClicked) {
    const currentSelectedCells = get(selectedCells);
    const firstSelectedCell = currentSelectedCells[0];
    if (
      firstSelectedCell &&
      firstSelectedCell.row === cell.row &&
      firstSelectedCell.column === cell.column
    ) {
      selectedCells.set([]);
    } else {
      selectedCells.set([cell]);
    }
  } else {
    selectedCells.add(cell, false);
  }
};

/**
 * Default action to do when users mouse enters a cell and meta button is down
 */
export const handleEnterCell: OnEnterCellHandler = (cell) => {
  if (get(selectedCells).length > 0) {
    selectedCells.add(cell);
  }
};

/** Default action to run when user moves around with the arrow buttons */
export const handleArrows = (direction: ArrowDirection, k: KeyboardEvent) => {
  const cells = get(selectedCells);
  const dim = get(gameHistory.clues).dimensions;
  const lastCell = cells[cells.length - 1];
  if (lastCell == null) return;
  const { row, column } = lastCell;
  let newCell: Position | null = null;
  switch (direction) {
    case 'up':
      if (row !== 0) {
        newCell = { row: row - 1, column };
      } else {
        newCell = { row: dim.rows - 1, column };
      }
      break;
    case 'right':
      if (column !== dim.columns - 1) {
        newCell = { row, column: column + 1 };
      } else {
        newCell = { row, column: 0 };
      }
      break;
    case 'down':
      if (row !== dim.rows - 1) {
        newCell = { row: row + 1, column };
      } else {
        newCell = { row: 0, column };
      }
      break;
    case 'left':
      if (column !== 0) {
        newCell = { row, column: column - 1 };
      } else {
        newCell = { row, column: dim.columns - 1 };
      }
      break;
    default:
      break;
  }
  if (newCell) {
    k.preventDefault();
    if (isCommandKey(k)) {
      selectedCells.add(newCell);
    } else {
      selectedCells.set([newCell]);
    }
  }
};
