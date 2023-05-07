<script>
  import { SudokuGame } from '$lib';
  import { defaultClues, defaultGameData } from '@octopuzzles/sudoku-utils';

  let clues = defaultClues();
  let gameData = defaultGameData();
  let initialGameData = gameData;
</script>

<SudokuGame
  {clues}
  scannerSettings={undefined}
  onScannerSettingsChange={console.log}
  bind:gameData
  {initialGameData}
  walkthrough={[]}
  onDone={console.log}
/>
