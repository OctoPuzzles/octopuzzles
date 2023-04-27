<script lang="ts">
  import { SudokuGame } from '@octopuzzles/sudoku-game';
  import { SudokuEditor } from '@octopuzzles/sudoku-editor';
  import { Button, Input, Label, PuzzleLabel, RichTextEditor } from '@octopuzzles/ui';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    defaultClues,
    defaultGameData,
    defaultCellValues,
    getUserSolution
  } from '@octopuzzles/sudoku-utils';
  import { page, navigating } from '$app/stores';
  import CommonDescriptionsModal from '$components/Sudoku/CommonDescriptionsModal.svelte';
  import Plus from 'phosphor-svelte/lib/Plus/Plus.svelte';
  import FileArrowDown from 'phosphor-svelte/lib/FileArrowDown/FileArrowDown.svelte';
  import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
  import classNames from 'classnames';
  import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
  import type { PageData } from './$types';
  import { trpc } from '$lib/trpc/client';
  import { fillCluesWithDefaults } from '$utils/fillSudokuWithDefaults';
  import { me } from '$stores/meStore';
  import type { Digit, GameHistoryStep } from '@octopuzzles/models';
  import { deepCopy } from '@octopuzzles/utils';
  import type { RouterInputs } from '$lib/trpc/router';
  import { exportPuzzle } from '$features/fpuzzles/exportAsFPuzzlesJson';
  import { FPuzzles, CtC } from '@octopuzzles/icons';

  export let data: PageData;

  let sudokuTitle = data.sudoku?.title ?? '';
  let description = data.sudoku?.description ?? '';
  let difficulty = data.sudoku?.difficulty;
  let labels =
    data.labels
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((l) => ({
        label: l,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selected: data.sudoku?.labels?.some((label) => label.id === l.id) ?? false
      })) ?? [];
  let walkthrough = data.walkthrough?.steps ?? [];
  let clues = fillCluesWithDefaults(data.sudoku ?? defaultClues());
  let initialClues = clues;
  let gameData: GameHistoryStep = {
    ...defaultGameData(data.sudoku?.dimensions),
    cellValues:
      data.sudoku?.solution?.numbers.map((row) =>
        row.map((value) => {
          const digits = value.split('');
          return digits.length > 0 ? { digits: digits as Digit[] } : {};
        })
      ) ?? defaultCellValues(data.sudoku?.dimensions)
  };
  const scannerSettings = me.settings;

  let id = data.sudoku?.id;
  let isPublic = data.sudoku?.publicSince != null;
  let provideSolution = data.sudoku?.solution != null;

  let errors: Record<string, string> = {};
  let loading = false;

  let showImportFromFPuzzlesModal = false;
  let showCommonDescriptionsModal = false;

  async function changeUpdateStatus(make_public: boolean): Promise<void> {
    loading = true;
    if (id != null) {
      const res = await trpc($page).sudokus.changePublicStatus.mutate({
        id,
        public: make_public
      });
      isPublic = res;
    }
    loading = false;
  }

  async function saveSolution(id: number): Promise<void> {
    let solution: RouterInputs['sudokus']['provideSolutionToPuzzle']['solution'] = undefined;
    // create solution
    if (provideSolution) {
      let cellValues = gameData.cellValues;
      if (walkthrough.length) {
        const finalStep = walkthrough[walkthrough.length - 1].gameData;
        if (
          gameData.cellValues.some((row, i) => {
            return row.some((cell, j) => {
              return cell.digits !== undefined && finalStep.cellValues[i][j].digits;
            });
          })
        ) {
          cellValues = finalStep.cellValues;
        }
      }
      solution = {
        numbers: getUserSolution({
          givens: clues.givens,
          values: cellValues.map((row) => row.map((cell) => cell.digits?.join('') ?? ''))
        })
      };
    }
    await trpc($page).sudokus.provideSolutionToPuzzle.mutate({
      sudokuId: id,
      solution
    });
  }

  onMount(async () => {
    if ($page.url.searchParams.get('import') != null) {
      showImportFromFPuzzlesModal = true;
    }
  });

  type Tabs = 'editor' | 'game' | 'form';
  let tab: Tabs = 'editor';

  async function save(): Promise<void> {
    loading = true;
    errors = {};
    try {
      const createdSudoku = await trpc($page).sudokus.create.mutate({
        sudoku: {
          title: sudokuTitle,
          description: description,
          difficulty: difficulty ?? null,
          dimensions: clues.dimensions,
          borderclues: clues.borderclues,
          cellclues: clues.cellclues,
          regions: clues.regions,
          cells: clues.cells,
          colors: clues.colors,
          givens: clues.givens,
          extendedcages: clues.extendedcages,
          paths: clues.paths,
          logic: clues.logic
        },
        labels: labels.filter((l) => l.selected).map((l) => l.label.id)
      });

      if (createdSudoku != null) {
        id = createdSudoku.id;
        $page.url.searchParams.set('id', id?.toString() as string);
        if (provideSolution) {
          await saveSolution(id);
        }

        if (walkthrough.length > 0) {
          await trpc($page).walkthroughs.createOrUpdate.mutate({
            sudokuId: createdSudoku.id,
            steps: walkthrough
          });
        }
      }
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => (errors.sudoku = error.message));
      }
    } finally {
      loading = false;
    }
  }

  async function update(): Promise<void> {
    loading = true;
    if (id == null) return;
    errors = {};
    try {
      const updatedSudoku = await trpc($page).sudokus.update.mutate({
        id,
        sudokuUpdates: {
          title: sudokuTitle,
          difficulty: difficulty ?? null,
          description: description,
          dimensions: clues.dimensions,
          borderclues: clues.borderclues,
          cellclues: clues.cellclues,
          regions: clues.regions,
          cells: clues.cells,
          colors: clues.colors,
          givens: clues.givens,
          extendedcages: clues.extendedcages,
          paths: clues.paths,
          logic: clues.logic
        },
        labels: labels.filter((l) => l.selected).map((l) => l.label.id)
      });

      if (updatedSudoku != null) {
        id = updatedSudoku.id;
        await saveSolution(updatedSudoku.id);

        if (walkthrough.length > 0) {
          await trpc($page).walkthroughs.createOrUpdate.mutate({
            sudokuId: updatedSudoku.id,
            steps: walkthrough
          });
        } else {
          await trpc($page).walkthroughs.delete.mutate({
            sudokuId: updatedSudoku.id
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  let descriptionEditor: RichTextEditor;

  async function deleteSudoku(): Promise<void> {
    loading = true;
    if (id != null) {
      await trpc($page).sudokus.delete.mutate({ id });
      await goto('/');
    }
    loading = false;
  }

  function doesSolutionHaveHoles(): boolean {
    if (clues.givens == null || gameData.cellValues == null) return false;

    const userSolution = getUserSolution({
      givens: clues.givens,
      values: gameData.cellValues.map((row) => row.map((cell) => cell.digits?.join('') ?? ''))
    });

    for (const row of userSolution) {
      for (const cell of row) {
        if (cell.length === 0) {
          return true;
        }
      }
    }

    return false;
  }

  let solutionHasHoles = false;
  $: if (gameData.cellValues != null && clues.givens != null) {
    solutionHasHoles = doesSolutionHaveHoles();
  }

  let exportDetails: HTMLDetailsElement;

  $: if ($navigating && exportDetails != null) exportDetails.open = false;
</script>

<div class="flex items-center justify-center h-20 absolute top-0 w-full pointer-events-none">
  <div class="max-w-48 pointer-events-auto border-b border-gray-200 flex gap-2">
    <button
      class={classNames(
        'p-2 border-b-2 border-transparent -mb-px',
        tab === 'editor' ? 'text-blue-500 border-blue-500' : 'text-black'
      )}
      type="button"
      on:click={() => (tab = 'editor')}>Editor</button
    >
    <button
      class={classNames(
        'p-2 border-b-2 border-transparent -mb-px',
        tab === 'game' ? 'text-blue-500 border-blue-500' : 'text-black'
      )}
      type="button"
      on:click={() => (tab = 'game')}>Solution</button
    >
    <button
      class={classNames(
        'p-2 border-b-2 border-transparent -mb-px',
        tab === 'form' ? 'text-blue-500 border-blue-500' : 'text-black'
      )}
      type="button"
      on:click={() => (tab = 'form')}>Details</button
    >
  </div>
</div>

<div class:hidden={tab !== 'editor'}>
  <SudokuEditor bind:clues {initialClues}>
    <button
      on:click={() => (showImportFromFPuzzlesModal = true)}
      class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
      title="Import from f-puzzles"
    >
      <FileArrowDown size={32} />
    </button>

    <details bind:this={exportDetails}>
      <summary
        class="cursor-pointer flex justify-center items-center mr-2 w-8 h-8 hover:ring hover:ring-orange-500 rounded"
        aria-label="Export to f-puzzles/CtC"
        aria-haspopup="menu"
        title="Export to f-puzzles/CtC"
      >
        <FileArrowUp size={32} />
      </summary>
      <div
        class="absolute list-none shadow-lg bg-white ring-1 ring-black ring-opacity-10 focus:outline-none rounded-md mt-0.5 overflow-hidden z-50"
        role="menu"
      >
        <button
          on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'FPuzzles')}
          class="w-8 h-8"
          title="Export to f-puzzles"
        >
          <FPuzzles />
        </button>
        <button
          on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'CTC')}
          class="w-8 h-8"
          title="Export to CtC"
        >
          <CtC />
        </button>
      </div>
    </details>
  </SudokuEditor>
</div>
<div class:hidden={tab !== 'game'}>
  <SudokuGame
    scannerSettings={$scannerSettings.scanner}
    onScannerSettingsChange={(newSettings) => me.saveSettings({ scanner: newSettings })}
    bind:walkthrough
    {clues}
    bind:gameData
  >
    <details bind:this={exportDetails}>
      <summary
        class="cursor-pointer flex justify-center items-center mr-2 w-8 h-8 hover:ring hover:ring-orange-500 rounded"
        aria-label="Export to f-puzzles/CtC"
        aria-haspopup="menu"
        title="Export to f-puzzles/CtC"
      >
        <FileArrowUp size={32} />
      </summary>
      <div
        class="absolute list-none shadow-lg bg-white ring-1 ring-black ring-opacity-10 focus:outline-none rounded-md mt-0.5 overflow-hidden z-50"
        role="menu"
      >
        <button
          on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'FPuzzles')}
          class="w-8 h-8"
          title="Export to f-puzzles"
        >
          <FPuzzles />
        </button>
        <button
          on:click={() => exportPuzzle(clues, gameData, sudokuTitle, description, 'CTC')}
          class="w-8 h-8"
          title="Export to CtC"
        >
          <CtC />
        </button>
      </div>
    </details>
  </SudokuGame>
</div>
<div class:hidden={tab !== 'form'}>
  <div class="m-auto container p-4">
    <form>
      <h1 class="text-3xl mb-2">Details</h1>
      {#if isPublic}
        <p class="text-green-500">Public</p>
      {/if}
      {#if errors}
        <ul class="mb-2">
          {#each Object.entries(errors) as [field, message]}
            {#if !['title', 'description'].includes(field)}
              <li class="text-red-500"><strong>{field}</strong>: {message}</li>
            {/if}
          {/each}
        </ul>
      {/if}

      <Input label="Title" bind:value={sudokuTitle} placeholder="My sudoku">
        <p slot="error">{errors.title ? errors.title : ''}</p>
      </Input>
      <Label>Description</Label>
      <div class="relative w-full">
        <button
          tabindex={-1}
          class="absolute top-2 p-1 right-2 w-6 h-6 rounded-full border border-orange-500 text-orange-500 bg-orange-100 hover:bg-orange-200 hover:text-orange-600 transition-colors shadow flex items-center justify-center"
          title="Add common descriptions"
          type="button"
          on:click={() => (showCommonDescriptionsModal = true)}><Plus size={24} /></button
        >
        <div class="rounded-lg border mt-2 p-1 min-h-[10rem]">
          <RichTextEditor
            bind:this={descriptionEditor}
            bind:content={description}
            placeholder="Normal sudoku rules apply..."
          />
          {#if errors.description}
            <p class="text-red-500">
              {errors.description}
            </p>
          {/if}
        </div>
      </div>

      <label
        class="flex items-center gap-2 mt-2"
        title="Save the solution given in the solution tab as the right solution"
      >
        <input type="checkbox" class="rounded text-blue-500" bind:checked={provideSolution} />
        <p>Provide the numbers in your solution as the correct solution</p>
        {#if provideSolution && solutionHasHoles}
          <p class="text-orange-500">
            Your solution has cells without numbers. If intentional, ignore this
          </p>
        {/if}
      </label>

      <div class="flex items-center mt-4">
        <p>Difficulty:</p>
        <ul class="flex items-center gap-1 ml-2">
          <li>
            <button
              class={classNames(
                'h-6 px-1 rounded border border-gray-400 flex items-center justify-center',
                difficulty == null && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = undefined)}>No difficulty</button
            >
          </li>
          <li>
            <button
              class={classNames(
                'w-6 h-6 rounded border border-gray-400 flex items-center justify-center',
                difficulty === 1 && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = 1)}>1</button
            >
          </li>
          <li>
            <button
              class={classNames(
                'w-6 h-6 rounded border border-gray-400 flex items-center justify-center',
                difficulty === 2 && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = 2)}>2</button
            >
          </li>
          <li>
            <button
              class={classNames(
                'w-6 h-6 rounded border border-gray-400 flex items-center justify-center',
                difficulty === 3 && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = 3)}>3</button
            >
          </li>
          <li>
            <button
              class={classNames(
                'w-6 h-6 rounded border border-gray-400 flex items-center justify-center',
                difficulty === 4 && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = 4)}>4</button
            >
          </li>
          <li>
            <button
              class={classNames(
                'w-6 h-6 rounded border border-gray-400 flex items-center justify-center',
                difficulty === 5 && 'bg-orange-500 !border-orange-500'
              )}
              on:click={() => (difficulty = 5)}>5</button
            >
          </li>
        </ul>
      </div>

      <h1 class="font-semibold mt-8">Labels</h1>
      <p class="mb-2">Pick the labels that match your puzzle</p>
      <div class="flex flex-wrap gap-3">
        {#each labels as label}
          <Label>
            <PuzzleLabel label={label.label} selected={label.selected} />
            <input
              type="checkbox"
              class="rounded text-blue-500 hidden"
              bind:checked={label.selected}
            />
          </Label>
        {/each}
      </div>

      <div class="mt-8 w-full flex justify-between">
        <div>
          {#if id}
            <Button type="button" {loading} variant="primary" on:click={() => update()}>
              Update
            </Button>

            {#if isPublic}
              <Button type="button" {loading} on:click={() => changeUpdateStatus(false)}
                >Depublish</Button
              >
            {:else}
              <Button type="button" {loading} on:click={() => changeUpdateStatus(true)}
                >Publish</Button
              >

              <a href="/sudoku/{id}"><Button type="button">Go to pre-release puzzle</Button></a>
            {/if}
          {:else}
            <Button type="button" {loading} variant="primary" on:click={() => save()}>Save</Button>
          {/if}
        </div>
        <div class="flex gap-2">
          {#if id}
            <Button variant="danger" {loading} on:click={deleteSudoku}>Delete</Button>
          {/if}
        </div>
      </div>
    </form>
  </div>
  <CommonDescriptionsModal
    bind:isOpen={showCommonDescriptionsModal}
    {labels}
    addLabel={(l) => {
      let newDescription = `<p><strong>${l.name}</strong>: ${l.description}</p>`;
      if (description.length !== 0) {
        newDescription = `${description}${newDescription}`;
      }
      descriptionEditor.setRichEditorContent(newDescription);
      const newLabels = deepCopy(labels);
      newLabels.map((label) => {
        if (l.id === label.label.id) {
          label.selected = true;
          return label;
        } else {
          return label;
        }
      });
      labels = newLabels;
      return description;
    }}
    currentDescription={description}
  />
</div>

<ImportFromFPuzzles
  bind:isOpen={showImportFromFPuzzlesModal}
  onImport={({ newEditorHistory, newGameHistory, newTitle, newDescription }) => {
    initialClues = newEditorHistory;
    gameData = newGameHistory;
    sudokuTitle = newTitle;
    description = newDescription;
  }}
/>

<style>
  /* Allow the export dropdown to close when pressing outside the dropdown */
  details[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 40;
    display: block;
    cursor: default;
    content: ' ';
    background: transparent;
  }
</style>
