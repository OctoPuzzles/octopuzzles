import type {
  GameHistoryStep,
  InputMode,
  Mode,
  Position,
  EditorHistoryStep
} from '@octopuzzles/models';
import { deepCopy } from '@octopuzzles/utils';
import type { Readable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import { defaultUserInputs } from '@octopuzzles/sudoku-utils';

// WRITABLES

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createGameHistoryStore() {
  // Step
  const step = writable(0);
  // History
  const history = writable<GameHistoryStep[]>([deepCopy(defaultUserInputs())]);

  const clues = writable<EditorHistoryStep>();

  function setClues(newClues: EditorHistoryStep): void {
    clues.set(newClues);
    reset(deepCopy(defaultUserInputs(newClues.dimensions)));
  }

  /**
   * Increase the editor step by one, and specify what changes have been made to the editor since last step. Will keep the state of the non-changed items
   */
  function set(newValues: Partial<GameHistoryStep>): void {
    const localHistory = deepCopy(get(history));
    const localStep = deepCopy(get(step));
    const newHistory = deepCopy(localHistory.slice(0, localStep + 1));
    const newStep = deepCopy(localHistory[localStep]);
    if (newHistory == null || newStep == null) return;
    Object.assign(newStep, newValues);
    history.set([...newHistory, newStep]);
    step.update((s) => s + 1);
  }

  /**
   * Get the state of the editor at the current step.
   * @example
   * // To get the current killercages
   * const killercages = getEditorState("killercages");
   */
  function getValue<T extends keyof GameHistoryStep>(type: T): Readable<GameHistoryStep[T]> {
    return derived([history, step], ([$gameHistory, $gameStep]) => {
      const res = $gameHistory[$gameStep]?.[type];
      if (typeof res === 'number') {
        return $gameHistory[res]?.[type] as GameHistoryStep[T];
      } else {
        return res as GameHistoryStep[T];
      }
    });
  }

  /**
   * Get the state of the game at the current step.
   */
  function subscribeToInputs(): Readable<GameHistoryStep> {
    return derived([history, step], ([$gameHistory, $gameStep]) => {
      return $gameHistory[$gameStep];
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
    step.update((step) => Math.min(get(history).length, step + 1));
  }

  const canRedo = derived([history, step], ([$history, $step]) => $step < $history.length - 1);

  /** Reset the game */
  function reset(startState?: GameHistoryStep): void {
    selectedItemIndex.set(-1);
    highlightedItemIndex.set(-1);
    selectedCells.set([]);
    highlightedCells.set([]);
    step.set(0);
    const dim = get(clues).dimensions;
    history.set([startState ?? defaultUserInputs(dim)]);
  }

  /** Clear every input-values, and colors from the specified cells in the editor */
  function clearCells(cells: Position[]): void {
    const newValues = get(getValue('values'));
    const newCornerMarks = get(getValue('cornermarks'));
    const newCenterMarks = get(getValue('centermarks'));
    const newColors = get(getValue('colors'));
    let changes = false;
    cells.forEach((cell) => {
      if (newValues[cell.row]?.[cell.column] !== '') {
        changes = true;
        newValues[cell.row][cell.column] = '';
      }
      if (newCornerMarks[cell.row][cell.column] !== '') {
        changes = true;
        newCornerMarks[cell.row][cell.column] = '';
      }
      if (newCenterMarks[cell.row][cell.column] !== '') {
        changes = true;
        newCenterMarks[cell.row][cell.column] = '';
      }
      if (newColors[cell.row][cell.column] != null) {
        changes = true;
        newColors[cell.row][cell.column] = [];
      }
    });
    if (changes) {
      set({
        values: newValues,
        cornermarks: newCornerMarks,
        centermarks: newCenterMarks,
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
    getValue,
    subscribeToInputs,
    clues: {
      subscribe: clues.subscribe,
      set: setClues
    }
  };
}

export const gameHistory = createGameHistoryStore();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createInputModeStore() {
  const { subscribe, set } = writable<InputMode | null>(null);

  return {
    subscribe,
    set: (value: InputMode | null) => {
      selectedItemIndex.set(-1);
      highlightedItemIndex.set(-1);
      set(value);
    }
  };
}

export const mode = writable<Mode>('game');
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