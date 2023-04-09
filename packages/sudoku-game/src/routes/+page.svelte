<script>
  import { SudokuGame } from '$lib';
  import { defaultClues, defaultUserInputs } from '@octopuzzles/sudoku-utils';

  let clues = defaultClues();
  let userInputs = defaultUserInputs();
</script>

<SudokuGame
  {clues}
  scannerSettings={undefined}
  onScannerSettingsChange={console.log}
  bind:userInputs
  walkthrough={[]}
  onDone={console.log}
/>
