<script lang="ts">
	import { cellSize } from '$constants';
	import SudokuDisplay from './Display/index.svelte';
	import Controller from './Controller/index.svelte';
	import Interface from '$features/sudoku/Interface.svelte';
	import { highlights } from '$stores/sudokuStore';
	import type { EditorHistoryStep } from '$types';

	const { selectedCells, highlightedCells } = highlights;

	// SIZING
	let windowHeight: number;
	let windowWidth: number;
	/**
	 * The sudoku should be contained within the screen
	 * However the screen might get so small, that we make it at least 300px big
	 */
	$: sudokuSize = Math.max(Math.min(windowHeight - 88, windowWidth), 300);

	export let clues: EditorHistoryStep;
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="flex flex-wrap w-full justify-around">
	<div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
		<SudokuDisplay {clues}>
			<g slot="highlights" id="highlights">
				{#if $selectedCells}
					{#each $selectedCells as cell}
						<rect
							class="fill-current w-cell h-cell text-orange-300 text-opacity-40"
							x={cellSize * cell.column}
							y={cellSize * cell.row}
							vector-effect="non-scaling-size"
						/>
					{/each}
				{/if}
				{#if $highlightedCells}
					{#each $highlightedCells as cell}
						<rect
							class="fill-current w-cell h-cell text-blue-100"
							x={cellSize * cell.column}
							y={cellSize * cell.row}
							vector-effect="non-scaling-size"
						/>
					{/each}
				{/if}
			</g>

			<Interface cells={clues.cells} dimensions={clues.dimensions} slot="interface" />
		</SudokuDisplay>
	</div>
	<div class="my-auto">
		<Controller />
	</div>
</div>
