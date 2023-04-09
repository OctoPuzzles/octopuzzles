<script>
  import { SudokuEditor } from '$lib';
  import { defaultClues } from '@octopuzzles/sudoku-utils';

  let initialClues = defaultClues();
  let clues = defaultClues();
</script>

<SudokuEditor {initialClues} bind:clues />
