<script>
  import { SudokuGame } from '$lib';
  import { defaultClues, defaultGameData } from '@octopuzzles/sudoku-utils';

  let clues = defaultClues();
  let gameData = defaultGameData();
</script>

<SudokuGame
  {clues}
  settings={undefined}
  onSettingsChange={console.log}
  bind:gameData
  walkthrough={[]}
  onDone={console.log}
/>
