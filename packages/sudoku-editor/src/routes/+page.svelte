<script>
  import { SudokuEditor } from '$lib';
  import { defaultClues } from '@octopuzzles/sudoku-utils';

  let clues = defaultClues();
  let initialClues = clues;
</script>

<SudokuEditor {initialClues} bind:clues />
