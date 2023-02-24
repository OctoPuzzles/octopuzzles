import { editorHistory, gameHistory, highlights, inputMode } from '$stores/sudokuStore';

export function resetAllSudokuStores(): void {
  const { highlightedCells, highlightedItemIndex, selectedCells, selectedItemIndex, wrongCells } =
    highlights;
  inputMode.set('values');
  highlightedItemIndex.set(-1);
  selectedItemIndex.set(-1);
  selectedCells.set([]);
  highlightedCells.set([]);
  wrongCells.set([]);
  editorHistory.reset();
  gameHistory.reset();
}
