<script lang="ts">
	import SudokuDisplay from '$components/Sudoku/Display/SudokuDisplay.svelte';
	import Controller from './Controller/index.svelte';
	import {
		highlights,
		inputMode,
		handleArrows,
		handleMouseDown,
		handleMouseEnter
	} from '$stores/sudokuStore';
	import type { EditorHistoryStep } from '$types';
	import type { GameData } from '$models/Sudoku';

	const { selectedCells, highlightedCells, wrongCells } = highlights;

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
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="flex flex-wrap w-full justify-around">
	<div class="p-2 mb-2" style="height: {sudokuSize}px; width: {sudokuSize}px" id="sudoku-display">
		<SudokuDisplay
			{clues}
			{gameData}
			highlightedCells={$highlightedCells}
			selectedCells={$selectedCells}
			wrongCells={$wrongCells}
			onClickNote={(note, position) => {
				$inputMode = 'notes';
				$selectedCells = [position];
			}}
			handleArrows={$handleArrows}
			handleMouseDown={$handleMouseDown}
			handleMouseEnter={$handleMouseEnter}
		/>
	</div>
	<div class="my-auto">
		<Controller />
	</div>
</div>
