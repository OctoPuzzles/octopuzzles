import type { Position } from '$models/Sudoku';
import { hasOpenModals } from '$stores/modalStore';
import { isCommandKey } from '$utils/isCommandKey';
import { get } from 'svelte/store';
import { editorHistory, selectedCells } from '.';

export type MouseDownHandler = ({
  cell,
  metaButtonClicked
}: {
  cell: Position;
  metaButtonClicked: boolean;
}) => void;
export type MouseEnterHandler = ({
  cell,
  metaButtonClicked,
  mouseDown
}: {
  cell: Position;
  metaButtonClicked: boolean;
  mouseDown: boolean;
}) => void;
export type ArrowHandler = ({
  k,
  metaButtonClicked
}: {
  k: KeyboardEvent;
  metaButtonClicked: boolean;
}) => void;
/**
 * Default action to do when user clicks on a cell
 */
export const defaultHandleMouseDown: MouseDownHandler = ({ cell, metaButtonClicked }) => {
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
    selectedCells.addCell(cell, false);
  }
};

/**
 * Default action to do when users mouse enters a cell and meta button is down
 */
export const defaultHandleMouseEnter: MouseEnterHandler = ({ cell, mouseDown }) => {
  if (mouseDown) {
    if (get(selectedCells).length > 0) {
      selectedCells.addCell(cell);
    }
  }
};

/** Default action to run when user moves around with the arrow buttons */
export const defaultHandleArrows: ArrowHandler = ({ k }) => {
  //do not accept keyboard input when any modal controls are open
  if (hasOpenModals()) return;

  const cells = get(selectedCells);
  const dim = editorHistory.getClue('dimensions');
  const lastCell = cells[cells.length - 1];
  if (lastCell == null) return;
  const { row, column } = lastCell;
  let newCell: Position | null = null;
  switch (k.key) {
    case 'ArrowUp':
      if (row !== 0) {
        newCell = { row: row - 1, column };
      } else {
        newCell = { row: dim.rows - 1, column };
      }
      break;
    case 'ArrowRight':
      if (column !== dim.columns - 1) {
        newCell = { row, column: column + 1 };
      } else {
        newCell = { row, column: 0 };
      }
      break;
    case 'ArrowDown':
      if (row !== dim.rows - 1) {
        newCell = { row: row + 1, column };
      } else {
        newCell = { row: 0, column };
      }
      break;
    case 'ArrowLeft':
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
      selectedCells.addCell(newCell);
    } else {
      selectedCells.set([newCell]);
    }
  }
};
