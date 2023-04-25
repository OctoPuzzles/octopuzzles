import type {
  Dimensions,
  EditorHistoryStep,
  EditorHistoryStepWithNumbers,
  InputMode,
  Label,
  Margins,
  Position
} from '@octopuzzles/models';
import type { OnClickCellHandler, OnEnterCellHandler } from '@octopuzzles/sudoku-display';
import {
  defaultBorderclues,
  defaultCages,
  defaultCellclues,
  defaultCells,
  defaultEditorColors,
  defaultGivens,
  defaultLogic,
  defaultPaths,
  defaultRegions,
  defaultClues
} from '@octopuzzles/sudoku-utils';
import { deepCopy } from '@octopuzzles/utils';
import type { Readable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import {
  defaultHandleArrows,
  defaultHandleMouseDown,
  defaultHandleMouseEnter
} from './interactionHandlers';

// WRITABLES
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createEditorHistoryStore() {
  // Step
  const step = writable(0);
  // History
  const history = writable<EditorHistoryStepWithNumbers[]>([deepCopy(defaultClues())]);

  // TODO: Move these out of this package
  const labels = writable<{ label: Label; selected: boolean }[]>([]);

  /**
   * Increase the editor step by one, and specify what changes have been made to the editor since last step. Will keep the state of the non-changed items
   */
  function set(newClues: Partial<EditorHistoryStep>): void {
    const localHistory = deepCopy(get(history));
    const localStep = deepCopy(get(step));
    const newHistory = deepCopy(localHistory.slice(0, localStep + 1));
    const newStep = deepCopy(localHistory[localStep]);
    if (newStep == null) return;
    for (const [key] of Object.entries(newStep)) {
      const k = key as keyof EditorHistoryStep;
      if (typeof newStep[k] !== 'number') {
        newStep[k] = localStep;
      }
    }
    newClues = Object.fromEntries(Object.entries(newClues).filter(([, value]) => Boolean(value)));
    Object.assign(newStep, newClues);
    history.set([...newHistory, newStep]);
    step.update((step) => step + 1);
  }

  function getCluesAtStep(
    _editorHistory: EditorHistoryStepWithNumbers[],
    s: number
  ): EditorHistoryStep {
    const historyStep = _editorHistory[s];
    for (const [clueType, clue] of Object.entries(historyStep)) {
      if (typeof clue === 'number') {
        historyStep[clueType as keyof EditorHistoryStep] = _editorHistory[clue][
          clueType as keyof EditorHistoryStep
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any;
      }
    }
    return historyStep as EditorHistoryStep;
  }

  /**
   * Increase the editor step by one, and specify what changes have been made to the editor since last step. Will keep the state of the non-changed items
   */
  function update(updater: (EditorHistory: EditorHistoryStep) => Partial<EditorHistoryStep>): void {
    const clues = getCluesAtStep(get(history), get(step));
    const newClues = updater(clues);
    set(newClues);
  }

  /**
   * Get the state of the editor at the current step.
   */
  function subscribeToClues(): Readable<EditorHistoryStep> {
    return derived([history, step], ([$editorHistory, $editorStep]) => {
      return getCluesAtStep($editorHistory, $editorStep);
    });
  }

  /**
   * Get the state of the editor at the current step.
   * @example
   * // To get the current killercages
   * const killercages = getEditorState("killercages");
   */
  function getClue<T extends keyof EditorHistoryStep>(type: T): Readable<EditorHistoryStep[T]> {
    return derived([history, step], ([$editorHistory, $editorStep]) => {
      const res = $editorHistory[$editorStep]?.[type];
      if (typeof res === 'number') {
        return $editorHistory[res]?.[type] as EditorHistoryStep[T];
      } else {
        return res as EditorHistoryStep[T];
      }
    });
  }

  /**
   * Undo a step in the editor
   */
  function undo(): void {
    step.update((oldStep) => Math.max(0, oldStep - 1));
  }

  const canUndo = derived(step, ($step) => $step > 0);

  function redo(): void {
    step.update((step) => Math.min(get(history).length - 1, step + 1));
  }

  const canRedo = derived([history, step], ([$history, $step]) => $step < $history.length - 1);

  /** Reset the editor */
  function reset(startState?: Partial<EditorHistoryStep>): void {
    const dim: Dimensions = startState?.dimensions || { rows: 9, columns: 9, margins: undefined };
    step.set(0);
    history.set([
      {
        givens: startState?.givens || defaultGivens(dim),
        extendedcages: startState?.extendedcages || defaultCages(),
        colors: startState?.colors || defaultEditorColors(dim),
        paths: startState?.paths || defaultPaths(),
        borderclues: startState?.borderclues || defaultBorderclues(),
        cellclues: startState?.cellclues || defaultCellclues(),
        dimensions: dim,
        cells: startState?.cells || defaultCells(dim),
        regions: startState?.regions || defaultRegions(dim),
        logic: startState?.logic || defaultLogic()
      }
    ]);
  }

  /** Clear every input-values, and colors from the specified cells in the editor */
  function clearCells(cells: Position[]): void {
    const newGivens = get(getClue('givens'));
    const newColors = get(getClue('colors'));
    let changes = false;
    cells.forEach((cell) => {
      let newGiven = newGivens[cell.row]?.[cell.column];
      if (newGiven !== '') {
        changes = true;
        newGiven = '';
      }
      let newColor = newColors[cell.row]?.[cell.column];
      if (newColor != null) {
        changes = true;
        newColor = null;
      }
    });
    if (changes) {
      set({
        givens: newGivens,
        colors: newColors
      });
    }
  }

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    clearCells,
    set,
    update,
    subscribeToClues,
    getClue,
    labels
  };
}
/**
 * The history of editor steps.
 * A field is either the current value, or an index of the last time it changed
 */
export const editorHistory = createEditorHistoryStore();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createInputModeStore() {
  const { subscribe, set } = writable<InputMode | null>(null);

  return {
    subscribe,
    set: (value: InputMode | null) => {
      selectedItemIndex.set(-1);
      highlightedItemIndex.set(-1);
      handleArrows.set(defaultHandleArrows);
      handleMouseDown.set(defaultHandleMouseDown);
      handleMouseEnter.set(defaultHandleMouseEnter);
      set(value);
    }
  };
}

export const inputMode = createInputModeStore();

export const selectedItemIndex = writable(-1);
export const highlightedItemIndex = writable(-1);
/** Cells with wrong solutions */
export const wrongCells = writable<Position[]>([]);
/**
 * A list of highlighted cells.
 * A highlighted cell is e.g. a hovered cell.
 */
export const highlightedCells = writable<Position[]>([]);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createSelectedCellsStore() {
  const _selectedCells = writable<Position[]>([]);

  function setSelectedCells(newSelectedCells: Position[]): void {
    selectedItemIndex.set(-1);
    highlightedItemIndex.set(-1);
    highlightedCells.set([]);
    _selectedCells.set(newSelectedCells);
  }

  function addSelectedCell(cell: Position, keepIfAlreadySelected = true): void {
    let found = false;
    _selectedCells.update((oldSelectedCells) => {
      let newSelectedCells = oldSelectedCells.filter((c) => {
        if (c.row === cell.row && c.column === cell.column) {
          found = true;
          return keepIfAlreadySelected;
        } else {
          return true;
        }
      });
      if (!found) {
        newSelectedCells = [...newSelectedCells, cell];
      }

      return newSelectedCells;
    });
  }

  return {
    subscribe: _selectedCells.subscribe,
    set: setSelectedCells,
    add: addSelectedCell
  };
}

/**
 * A list of selected cells.
 * A selected cell is one that is pressed on with e.g. the mouse
 */
export const selectedCells = createSelectedCellsStore();

/**
 * The controller components can augment the functionality and how user inputs should be handled by changing this function.
 * This function specifies what to do when a user clicks a cell.
 */
export const handleMouseDown = writable<OnClickCellHandler>(defaultHandleMouseDown);
/**
 * The controller components can augment the functionality and how user inputs should be handled by changing this function.
 * This function specifies what to do when a user enters a cell with their mouse and the meta button is clicked.
 */
export const handleMouseEnter = writable<OnEnterCellHandler>(defaultHandleMouseEnter);
/**
 * The controller components can augment the functionality and how user inputs should be handled by changing this function.
 * This function specifies what to do when a user moves around the board with the arrow buttons.
 */
export const handleArrows = writable(defaultHandleArrows);

// DERIVED STORES

export function setMargins(margins?: Margins | null): void {
  const {
    dimensions,
    borderclues,
    cellclues,
    colors,
    extendedcages,
    givens,
    paths,
    cells,
    regions
  } = get(editorHistory.subscribeToClues());

  const offsets: Margins = {
    left: (margins?.left ?? 0) - (dimensions.margins?.left ?? 0),
    right: (margins?.right ?? 0) - (dimensions.margins?.right ?? 0),
    top: (margins?.top ?? 0) - (dimensions.margins?.top ?? 0),
    bottom: (margins?.bottom ?? 0) - (dimensions.margins?.bottom ?? 0)
  };
  if (offsets.left !== 0 || offsets.right !== 0 || offsets.top !== 0 || offsets.bottom !== 0) {
    const newDimensions = {
      rows: dimensions.rows + offsets.top + offsets.bottom,
      columns: dimensions.columns + offsets.left + offsets.right,
      margins:
        margins && (margins.left > 0 || margins.right > 0 || margins.top > 0 || margins.bottom > 0)
          ? margins
          : undefined
    };
    const isValidPosition = (p: Position, modifier = 0): boolean =>
      p.row >= 0 &&
      p.row < newDimensions.rows + modifier &&
      p.column >= 0 &&
      p.column < newDimensions.columns + modifier;

    editorHistory.set({
      dimensions: newDimensions,
      borderclues: borderclues
        .map((clue) => {
          return {
            ...clue,
            positions: offsetPositions(clue.positions, offsets) as [Position, Position]
          };
        })
        .filter((clue) => clue.positions.every(isValidPosition)),
      cellclues: cellclues
        .map((clue) => {
          return {
            ...clue,
            position: {
              row: clue.position.row + offsets.top,
              column: clue.position.column + offsets.left
            }
          };
        })
        .filter((clue) => isValidPosition(clue.position)),
      colors: offsetMatrix(colors, offsets, null),
      extendedcages: extendedcages
        .map((cage) => {
          return { ...cage, positions: offsetPositions(cage.positions, offsets) };
        })
        .filter((clue) => clue.positions.every(isValidPosition)),
      givens: offsetMatrix(givens, offsets, ''),
      paths: paths
        .map((path) => {
          return { ...path, positions: offsetPositions(path.positions, offsets) };
        })
        .filter((clue) => clue.positions.every(isValidPosition)),
      cells: offsetMatrix(cells, offsets, false),
      regions: regions
        .map((region) => {
          return { ...region, positions: offsetPositions(region.positions, offsets) };
        })
        .filter((region) => region.positions.every(isValidPosition))
    });

    selectedCells.set(offsetPositions(get(selectedCells), offsets).filter(isValidPosition));
    highlightedCells.set(offsetPositions(get(highlightedCells), offsets).filter(isValidPosition));
    wrongCells.set(offsetPositions(get(wrongCells), offsets).filter(isValidPosition));
  }
}

function offsetPositions(positions: Position[], offsets: Margins): Position[] {
  return positions.map((position) => {
    return { row: position.row + offsets.top, column: position.column + offsets.left };
  });
}

function offsetMatrix<T>(clues: T[][], offsets: Margins, frameValue: T): T[][] {
  const newClues = deepCopy(
    Array(clues.length + offsets.top + offsets.bottom).fill(
      Array(clues[0].length + offsets.left + offsets.right).fill(frameValue)
    )
  );
  for (let i = 0; i < clues.length; ++i) {
    if (i + offsets.top < 0) continue;
    if (i + offsets.top >= newClues.length) break;
    for (let j = 0; j < clues[0].length; ++j) {
      if (j + offsets.left < 0) continue;
      if (j + offsets.left >= newClues[i + offsets.top].length) break;
      newClues[i + offsets.top][j + offsets.left] = clues[i][j];
    }
  }
  return newClues;
}
