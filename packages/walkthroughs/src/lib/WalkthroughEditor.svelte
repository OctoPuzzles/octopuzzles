<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import { Button, RichTextEditor } from '@octopuzzles/ui';
  import ArrowsCounterClockwise from 'phosphor-svelte/lib/ArrowsCounterClockwise/ArrowsCounterClockwise.svelte';
  import Trash from 'phosphor-svelte/lib/Trash/Trash.svelte';
  import Swap from 'phosphor-svelte/lib/Swap/Swap.svelte';
  import ArrowsOutLineVertical from 'phosphor-svelte/lib/ArrowsOutLineVertical/ArrowsOutLineVertical.svelte';
  import type { EditorHistoryStep, GameHistoryStep, WalkthroughStep } from '@octopuzzles/models';
  import { afterUpdate } from 'svelte';
  import { deepCopy } from '@octopuzzles/utils';

  export let clues: EditorHistoryStep;
  export let gameData: GameHistoryStep;
  export let walkthrough: WalkthroughStep[];
  export let onClickStep: (gameData: GameHistoryStep) => void;

  $: if (walkthrough.length > steps.length) {
    steps = walkthrough.map((w, i) => ({ ...w, key: String(i) }));
  } else {
    walkthrough = steps;
  }

  function scrollToStep(stepNo: number): void {
    const element = document.querySelector('#step' + stepNo);
    if (element) {
      element.scrollIntoView();
    }
  }

  afterUpdate(() => {
    scrollToStep(currentStepIndex);
  });

  // The timestamp is used for keyed lists in svelte
  let steps: (WalkthroughStep & { key: string })[] = walkthrough.map((w, i) => ({
    ...w,
    key: String(i)
  }));
  let currentStepIndex = walkthrough.length - 1;

  function removeStep(stepIndex: number): void {
    const currentSteps = deepCopy(steps);

    const newSteps = currentSteps.filter((_, i) => i !== stepIndex);

    steps = newSteps;
    walkthrough = newSteps;

    currentStepIndex = Math.max(stepIndex - 1, 0);
  }

  function addStep(stepIndex = -1, replace = false): void {
    const currentSteps = deepCopy(steps);

    const newStep = {
      description: stepIndex >= 0 && replace ? currentSteps[stepIndex].description : '',
      gameData: deepCopy(gameData),
      key: new Date().toString()
    };

    if (stepIndex > -1) {
      currentSteps.splice(stepIndex, replace ? 1 : 0, newStep);
      steps = currentSteps;
    } else {
      steps = [...currentSteps, newStep];
    }

    currentStepIndex = stepIndex > -1 ? stepIndex : currentSteps.length;
  }
</script>

<div class="h-full flex-1 overflow-y-hidden flex flex-col">
  <div class="w-full flex-1 p-2 bg-gray-100 border-b border-gray-200">
    <h2 class="text-center font-bold text-2xl">Walkthrough</h2>
    <p>Info: We automatically save your walkthrough whenever you save your sudoku puzzle</p>
  </div>

  <div class="shrink overflow-y-auto p-4 flex flex-col">
    {#if steps.length === 0}
      <p class="text-gray-700">No steps added yet</p>
    {/if}
    {#each steps as { gameData, description, key }, i (key)}
      <div id={'step' + i}>
        <div>
          <div class="flex space-x-4 items-center mb-2 mt-2">
            <h4 class="font-medium">Step {i + 1}</h4>
            <button
              class="w-6 h-6 rounded-full p-1 hover:bg-gray-100 hover:text-gray-600"
              on:click={() => {
                onClickStep(gameData);
              }}
              title="Reset to this step"><ArrowsCounterClockwise size={16} /></button
            >
            <button
              on:click={() => addStep(i)}
              title="Insert a new step"
              class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
            >
              <ArrowsOutLineVertical size={16} />
            </button>
            <button
              on:click={() => addStep(i, true)}
              title="Replace this step"
              class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
            >
              <Swap size={16} />
            </button>
            <button
              type="button"
              on:click={() => removeStep(i)}
              title="Delete this step"
              class="w-6 h-6 rounded-full p-1 hover:bg-red-100 hover:text-red-600"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
        <div class="grid gap-2 grid-cols-2">
          <div>
            <SudokuDisplay {clues} {gameData} />
          </div>
          <div>
            <div
              class="border border-gray-300 py-2 px-4 leading-5 rounded-md w-full focus:ring focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-200 h-full min-h-full"
            >
              <RichTextEditor
                bind:content={description}
                placeholder="Add a description"
                onChange={() => {
                  currentStepIndex = i;
                  walkthrough = steps;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="w-full flex justify-center mt-2 flex-1 bg-gray-100 py-3 border-t border-gray-200">
    <Button variant="primary" on:click={() => addStep()}>Add step to walkthrough</Button>
  </div>
</div>
