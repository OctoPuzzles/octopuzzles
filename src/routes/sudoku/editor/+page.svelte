<script lang="ts">
  import SudokuGame from '$components/Sudoku/Game.svelte';
  import Button from '$ui/Button.svelte';
  import Input from '$ui/Input.svelte';
  import RadioGroup from '$ui/RadioGroup.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    defaultCentermarks,
    defaultCornermarks,
    defaultGameColors,
    defaultValues
  } from '$utils/defaults';
  import { page } from '$app/stores';
  import { openModal } from '$stores/modalStore';
  import CommonDescriptionsModal from '$components/Sudoku/CommonDescriptionsModal.svelte';
  import { Plus } from 'phosphor-svelte';
  import { getUserSolution } from '$utils/getSolution';
  import {
    description,
    editorHistory,
    gameHistory,
    sudokuTitle,
    labels,
    mode
  } from '$stores/sudokuStore';
  import Label from '$ui/Label.svelte';
  import classNames from 'classnames';
  import {
    getAllBorderClues,
    getAllCages,
    getAllCellClues,
    isDefaultBorders
  } from '$utils/migration';
  import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
  import { walkthroughStore } from '$stores/walkthroughStore';
  import type { PageData } from './$types';
  import type { ObjectId } from 'mongodb';
  import trpc, { type InferMutationInput } from '$lib/client/trpc';
  import { fillWalkthroughStore } from '$utils/fillWalkthroughStore';

  export let data: PageData;

  $: if (data.walkthrough?.steps) {
    // Just so ts will shut up
    fillWalkthroughStore(data.walkthrough);
  } else {
    walkthroughStore.set([]);
  }

  async function changeUpdateStatus(make_public: boolean): Promise<void> {
    loading = true;
    if (id) {
      try {
        const res = await trpc().mutation('sudokus:changePublicStatus', {
          id,
          public: make_public
        });
        isPublic = res;
      } catch (e) {
        console.error(e);
      }
    }
    loading = false;
  }

  async function createOrUpdateWalkthrough(data: InferMutationInput<'walkthrougs:createOrUpdate'>) {
    return await trpc().mutation('walkthrougs:createOrUpdate', data);
  }

  async function saveSolution(id: ObjectId): Promise<void> {
    let solution: InferMutationInput<'sudokus:provideSolutionToPuzzle'>['solution'] = undefined;
    // create solution
    if (provideSolution) {
      solution = { numbers: getUserSolution({ givens: $givens, values: $values }) };
    }
    await trpc().mutation('sudokus:provideSolutionToPuzzle', { sudokuId: id, solution });
  }

  onMount(async () => {
    let sud = data.sudoku;

    gameHistory.reset();
    $labels =
      data.labels.map((l) => ({
        label: l,
        selected: sud?.labels?.includes(l._id) ?? false
      })) ?? [];
    if (sud != null) {
      $sudokuTitle = sud.title;
      $description = sud.description;
      id = sud._id;
      provideSolution = sud.solution != null;
      isPublic = sud.public_since != null;
      gameHistory.set({
        values: defaultValues(sud.dimensions),
        centermarks: defaultCentermarks(sud.dimensions),
        cornermarks: defaultCornermarks(sud.dimensions),
        colors: defaultGameColors(sud.dimensions)
      });
      editorHistory.reset({
        borderclues: getAllBorderClues(sud.borderclues, sud.borders, sud.dimensions) ?? undefined,
        cellclues: getAllCellClues(sud.cellclues, sud.cornerclues, sud.symbols) ?? undefined,
        regions: sud.regions ?? (!isDefaultBorders(sud.borders, sud.dimensions) ? [] : undefined),
        givens: sud.givens ?? undefined,
        cells: sud.cells ?? undefined,
        editorcolors: sud.colors ?? undefined,
        cages: getAllCages(sud.extendedcages, sud.killercages) ?? undefined,
        paths: sud.paths ?? undefined,
        dimensions: sud.dimensions,
        logic: sud.logic ?? undefined
      });
      if (sud.solution) {
        gameHistory.set({
          values: sud.solution.numbers
        });
      }
    } else {
      $sudokuTitle = '';
      $description = '';

      editorHistory.reset();
    }

    if ($page.url.searchParams.get('import')) {
      openModal(ImportFromFPuzzles);
    }
  });

  type Tabs = 'editor' | 'game' | 'form';
  let tab: Tabs = 'editor';
  $: if (tab === 'editor') {
    $mode = 'editor';
  } else {
    $mode = 'game';
  }

  let id: ObjectId | undefined = undefined;
  let isPublic = false;
  let errors: Record<string, string> = {};
  let loading = false;
  let provideSolution = false;

  let givens = editorHistory.getClue('givens');
  let borderclues = editorHistory.getClue('borderclues');
  let cellclues = editorHistory.getClue('cellclues');
  let regions = editorHistory.getClue('regions');
  let cells = editorHistory.getClue('cells');
  let editorColors = editorHistory.getClue('editorcolors');
  let cages = editorHistory.getClue('cages');
  let paths = editorHistory.getClue('paths');
  let dimensions = editorHistory.getClue('dimensions');
  let logic = editorHistory.getClue('logic');

  let values = gameHistory.getValue('values');
  let gameColors = gameHistory.getValue('colors');
  let cornermarks = gameHistory.getValue('cornermarks');
  let centermarks = gameHistory.getValue('centermarks');
  let notes = gameHistory.getValue('notes');

  async function save(): Promise<void> {
    loading = true;
    errors = {};
    try {
      const createdSudoku = await trpc().mutation('sudokus:create', {
        sudoku: {
          title: $sudokuTitle,
          description: $description,
          dimensions: $dimensions,
          borderclues: $borderclues,
          cellclues: $cellclues,
          regions: $regions,
          cells: $cells,
          colors: $editorColors,
          givens: $givens,
          extendedcages: $cages,
          paths: $paths,
          logic: $logic,
          labels: $labels.filter((l) => l.selected).map((l) => l.label._id)
        }
      });

      if (createdSudoku != null) {
        id = createdSudoku._id;
        $page.url.searchParams.set('id', id?.toString() as string);
        if (provideSolution) {
          await saveSolution(id);
        }

        if ($walkthroughStore.length > 0) {
          await createOrUpdateWalkthrough({
            sudoku_id: createdSudoku._id,
            steps: $walkthroughStore
          });
        }
      }
    } catch (e) {
      console.error(e);
      if (Array.isArray(e)) {
        e.forEach((error) => (errors.sudoku = error.message));
      }
    } finally {
      loading = false;
    }
  }

  async function update(): Promise<void> {
    loading = true;
    if (!id) return;
    errors = {};
    try {
      const updatedSudoku = await trpc().mutation('sudokus:update', {
        id,
        sudokuUpdates: {
          title: $sudokuTitle,
          description: $description,
          dimensions: $dimensions,
          borderclues: $borderclues,
          cellclues: $cellclues,
          regions: $regions,
          cells: $cells,
          colors: $editorColors,
          givens: $givens,
          extendedcages: $cages,
          paths: $paths,
          logic: $logic,
          labels: $labels.filter((l) => l.selected).map((l) => l.label._id)
        }
      });

      if (updatedSudoku != null) {
        id = updatedSudoku._id;
        await saveSolution(id);

        if ($walkthroughStore.length > 0) {
          await createOrUpdateWalkthrough({
            sudoku_id: updatedSudoku._id,
            steps: $walkthroughStore
          });
        } else {
          await trpc().mutation('walkthrougs:delete', {
            sudokuId: updatedSudoku._id.toString()
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function openAddDescriptionModal(): void {
    openModal(CommonDescriptionsModal, {
      addLabel: (l) => {
        if ($description.length === 0) {
          $description = `${l.name}: ${l.description}`;
        } else {
          $description = `${$description}\n\n${l.name}: ${l.description}`;
        }
        let newLabels = $labels;
        newLabels.map((label) => {
          if (l._id === label.label._id) {
            label.selected = true;
            return label;
          } else {
            return label;
          }
        });
        $labels = newLabels;
        return $description;
      },
      currentDescription: $description
    });
  }

  async function deleteSudoku(): Promise<void> {
    loading = true;
    if (id) {
      await trpc().mutation('sudokus:delete', { id });
      await goto('/');
    }
    loading = false;
  }

  function doesSolutionHaveHoles(): boolean {
    if (!$givens || !$values) return false;

    let userSolution = getUserSolution({ givens: $givens, values: $values });

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
  $: if ($values && $givens) {
    solutionHasHoles = doesSolutionHaveHoles();
  }
</script>

<div class="flex items-center justify-center h-20 absolute top-0 w-full pointer-events-none">
  <div class="max-w-48 pointer-events-auto">
    <RadioGroup
      options={{ editor: 'Editor', game: 'Solution', form: 'Details' }}
      bind:value={tab}
      onChange={undefined}
    />
  </div>
</div>

{#if tab === 'editor'}
  <SudokuGame
    givens={$givens}
    borderClues={$borderclues}
    cellClues={$cellclues}
    regions={$regions}
    cells={$cells}
    editorColors={$editorColors}
    cages={$cages}
    paths={$paths}
    dimensions={$dimensions}
    logic={$logic}
    values={[]}
    gameColors={[]}
    cornermarks={[]}
    centermarks={[]}
    notes={[]}
  />
{:else if tab === 'game'}
  <SudokuGame
    givens={$givens}
    borderClues={$borderclues}
    cellClues={$cellclues}
    regions={$regions}
    cells={$cells}
    editorColors={$editorColors}
    cages={$cages}
    paths={$paths}
    dimensions={$dimensions}
    logic={$logic}
    values={$values}
    gameColors={$gameColors}
    cornermarks={$cornermarks}
    centermarks={$centermarks}
    notes={$notes}
  />
{:else}
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

      <Input label="Title" bind:value={$sudokuTitle} placeholder="My sudoku">
        <p slot="error">{errors.title ? errors.title : ''}</p>
      </Input>
      <div class="relative">
        <button
          class="absolute top-8 p-1 right-2 w-6 h-6 rounded-full border border-orange-500 text-orange-500 bg-orange-100 hover:bg-orange-200 hover:text-orange-600 transition-colors shadow flex items-center justify-center"
          title="Add common descriptions"
          type="button"
          on:click={openAddDescriptionModal}><Plus size={24} /></button
        >
        <Input
          label="Description"
          bind:value={$description}
          asTextarea
          placeholder="Normal sudoku rules apply..."
        >
          <p slot="error">
            {errors.description ? errors.description : ''}
          </p>
        </Input>
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

      <h1 class="font-semibold mt-8">Labels</h1>
      <p class="mb-2">Pick the labels that match your puzzle</p>
      <div class="flex flex-wrap gap-2">
        {#each $labels as label}
          <Label
            class={classNames('cursor-pointer p-2 rounded-md shadow w-52', {
              'ring-blue-500 ring-2': label.selected,
              'ring-gray-300 ring-1': !label.selected
            })}
          >
            <h6 class="font-semibold">{label.label.name}</h6>
            <p>{label.label.description}</p>
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
              <Button
                type="button"
                class="bg-yellow-500"
                {loading}
                on:click={() => changeUpdateStatus(false)}>Depublish</Button
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
{/if}