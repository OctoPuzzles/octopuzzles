<script lang="ts">
  import { SudokuDisplay } from '@octopuzzles/sudoku-display';
  import Controller from './Controller/index.svelte';
  import Check from 'phosphor-svelte/lib/Check/Check.svelte';
  import {
    selectedCells,
    highlightedCells,
    wrongCells,
    inputMode,
    gameHistory,
    handleMouseDownHitbox,
    handleMouseEnterHitbox
  } from '$lib/sudokuStore';
  import type {
    EditorHistoryStep,
    GameData,
    Solution,
    UserSettings,
    WalkthroughStep
  } from '@octopuzzles/models';
  import { defaultClues, getValidDigits } from '@octopuzzles/sudoku-utils';
  import { scanner } from '$lib/sudokuStore/scanner';
  import { onDestroy, onMount, setContext } from 'svelte';
  import { gameAction, handleWindowClick } from '$lib/gameAction';
  import {
    handleArrows,
    handleClickCell,
    handleEnterCell
  } from '$lib/sudokuStore/interactionHandlers';
  import { NotificationModal } from '@octopuzzles/ui';

  // SIZING
  let windowHeight: number;
  let windowWidth: number;
  /**
   * The sudoku should be contained within the screen
   * However the screen might get so small, that we make it at least 300px big
   */
  $: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

  export let clues: EditorHistoryStep;

  export let gameData: GameData;

  export let walkthrough: WalkthroughStep[];

  export let solution: Solution | undefined = undefined;

  export let settings: Partial<UserSettings> | undefined;

  export let onSettingsChange: (newSettings: Partial<UserSettings>) => void;
  setContext('updateSettings', onSettingsChange);

  export let onDone: (() => void) | undefined = undefined;

  onMount(() => {
    gameHistory.clues.set(clues);
  });

  onDestroy(() => {
    gameHistory.clues.set(defaultClues());
  });

  const storeGameData = gameHistory.subscribeToInputs();

  $: onInput($storeGameData);

  $: gameHistory.clues.set(clues);

  $: scanner.configure(settings?.scanner);

  function isComplete(): boolean {
    const allDigits = getValidDigits(clues.logic, clues.dimensions);
    //check that every row has the required number of digits before validating the solution
    const complete = !gameData.cellValues.some((row, i) => {
      let numDigits = 0;
      row.forEach((cell, j) => {
        numDigits += clues.givens[i][j] !== '' ? 1 : cell.digits?.length ?? 0;
      });
      return numDigits !== allDigits.length;
    });
    return complete;
  }

  function onInput(newGameData: GameData): void {
    gameData = newGameData;

    const verificationMode = settings?.general?.verificationMode ?? 'OnDemand';
    if (isComplete()) {
      if (checkSolution(verificationMode !== 'OnDemand')) {
        onDone?.();
      }
      return;
    }

    if (verificationMode === 'OnInput') {
      $wrongCells = scanner.getErrorCells();
    } else {
      $wrongCells = [];
    }
  }

  function checkSolution(showErrors: boolean): boolean {
    //check that the provided solution has the same dimensions as the user input
    if (solution != null) {
      if (
        solution.numbers.length !== gameData.cellValues.length ||
        solution.numbers[0].length !== gameData.cellValues[0].length
      ) {
        return false;
      }
    }
    //check for errors against the provided solution or the puzzle logic
    const errorCells = scanner.getErrorCells(solution?.numbers);
    if (showErrors) {
      $wrongCells = errorCells;
    } else {
      $wrongCells = [];
    }
    return errorCells.length === 0;
  }

  let constraintsChecked = false;

  function verify(): void {
    if (isComplete()) {
      if (checkSolution(true)) {
        if (onDone != null) {
          onDone?.();
        } else {
          constraintsChecked = true;
        }
      }
      return;
    }

    const errorCells = scanner.getErrorCells();
    $wrongCells = errorCells;
    constraintsChecked = errorCells.length === 0;
  }
</script>

<svelte:window
  bind:innerHeight={windowHeight}
  bind:innerWidth={windowWidth}
  on:click={handleWindowClick}
  use:gameAction={{ onArrowKeyDown: handleArrows }}
/>

<div class="flex flex-wrap w-full justify-around" id="sudoku-game">
  <div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
    <SudokuDisplay
      {clues}
      {gameData}
      highlightedCells={$highlightedCells}
      selectedCells={$selectedCells}
      wrongCells={$wrongCells}
      onClickNote={(_, position) => {
        $inputMode = 'notes';
        $selectedCells = [position];
      }}
      onClickCell={handleClickCell}
      onEnterCell={handleEnterCell}
      onMouseDownHitbox={$handleMouseDownHitbox}
      onMouseEnterHitbox={$handleMouseEnterHitbox}
    />
  </div>
  <div class="my-auto">
    <Controller bind:walkthrough>
      <button
        title="Check digits"
        class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
        on:click={verify}
      >
        <Check size={32} />
      </button>
      <slot />
    </Controller>
  </div>
</div>

<NotificationModal
  bind:isOpen={constraintsChecked}
  notificationMessage="No constraint violations detected"
/>
