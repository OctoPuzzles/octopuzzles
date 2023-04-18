<script lang="ts">
  import {
    FacebookLink,
    RedditLink,
    TwitterLink,
    WhatsAppLink,
    Button,
    Modal
  } from '@octopuzzles/ui';
  import Image from 'phosphor-svelte/lib/Image/Image.svelte';

  export let isOpen: boolean;
  export let sudokuId: number;
  export let takeScreenshot: () => void;
  export let finishTime: string;
</script>

<Modal bind:isOpen let:close>
  <div class="p-4">
    <h1 class="text-3xl mb-2 text-center">Congratulations!</h1>
    <p class="text-center text-lg">You finished the puzzle!</p>

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
