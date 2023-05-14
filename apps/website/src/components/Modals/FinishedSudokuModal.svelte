<script lang="ts">
  import {
    FacebookLink,
    Input,
    RedditLink,
    TwitterLink,
    WhatsAppLink,
    Button,
    Modal
  } from '@octopuzzles/ui';
  import ClipboardText from 'phosphor-svelte/lib/ClipboardText/ClipboardText.svelte';
  import Image from 'phosphor-svelte/lib/Image/Image.svelte';
  import { getUserSolution } from '@octopuzzles/sudoku-utils';
  import type { EditorHistoryStep, GameHistoryStep } from '@octopuzzles/models';

  export let isOpen: boolean;
  export let sudokuId: number;
  export let takeScreenshot: () => void;
  export let finishTime: string;

  export let clues: EditorHistoryStep;
  export let gameData: GameHistoryStep;

  let solutionCodeKey = '';

  function generateSolutionCode(): string {
    const solution = getUserSolution(gameData.cellValues, clues.givens);

    let solutionCode = '';
    solutionCodeKey.split(';').forEach((k) => {
      if (k[0] === 'R') {
        const row = parseInt(k.substring(1)) - 1;
        if (row >= 0 && row < solution.length) {
          solution[row].forEach((value) => {
            solutionCode += value;
          });
        }
      } else if (k[0] === 'C') {
        const column = parseInt(k.substring(1)) - 1;
        if (column >= 0 && column < solution[0].length) {
          solution.forEach((r) => {
            solutionCode += r[column];
          });
        }
      }
    });

    return solutionCode;
  }

  async function copySolutionCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(generateSolutionCode());
    } catch (err) {
      console.error('Failed to copy solution code: ', err);
    }
  }
</script>

<Modal bind:isOpen let:close>
  <div class="p-4">
    <h1 class="text-3xl mb-2 text-center">Congratulations!</h1>
    <p class="text-center text-lg">You finished the puzzle!</p>

    <div class="flex space-x-2 mx-auto my-4">
      <Input label="Solution Code:" bind:value={solutionCodeKey} placeholder="e.g. R1;C1" />
      <button title="Copy code to clipboard" on:click={copySolutionCode}
        ><ClipboardText size={24} /></button
      >
    </div>

    <div class="flex space-x-2 mx-auto my-8">
      <p>Share:</p>
      <TwitterLink
        class="w-6 h-6 block"
        url="https://www.octopuzzles.com/sudoku/{sudokuId}"
        text="I solved this in {finishTime}, can you do better?"
      />

      <FacebookLink class="w-6 h-6 block" url="https://www.octopuzzles.com/sudoku/{sudokuId}" />

      <WhatsAppLink
        class="w-6 h-6 block"
        text="I solved this in {finishTime}, can you do better? https://www.octopuzzles.com/sudoku/{sudokuId}"
      />

      <RedditLink
        class="w-6 h-6 block"
        text="I solved this in {finishTime}, can you do better?"
        url="https://www.octopuzzles.com/sudoku/{sudokuId}"
      />

      <button class="w-6 h-6 block" title="Take image of sudoku" on:click={takeScreenshot}
        ><Image size={24} /></button
      >
    </div>

    <Button variant="primary" class="w-full" on:click={close}>Okay</Button>
  </div>
</Modal>
