<script lang="ts">
	import { cellSize } from '$constants';
	import type { EditorHistoryStep, GameHistoryStep } from '$types';
	import BorderClues from './Clues/borderclues/BorderClues.svelte';
	import CellClues from './Clues/CellClues.svelte';
	import Cells from './Clues/Cells.svelte';
	import Colors from './Clues/Colors.svelte';
	import CornerMarks from './Clues/CornerMarks.svelte';
	import CenterMarks from './Clues/CenterMarks.svelte';
	import KillerCages from './Clues/killercages/KillerCages.svelte';
	import Numbers from './Clues/Numbers.svelte';
	import Paths from './Clues/paths/Paths.svelte';
	import Notes from './Clues/Notes.svelte';
	import Logic from './Clues/Logic.svelte';
	import Regions from './Clues/Regions.svelte';
	import type { Position } from '$models/Sudoku';
	import Interface from './Clues/Interface.svelte';
	import type {
		ArrowHandler,
		MouseDownHandler,
		MouseEnterHandler
	} from '$stores/sudokuStore/interactionHandlers';

	export let clues: EditorHistoryStep;
	export let userInputs: GameHistoryStep | undefined = undefined;
	export let selectedCells: Position[] | undefined = undefined;
	export let highlightedCells: Position[] | undefined = undefined;
	export let wrongCells: Position[] | undefined = undefined;

	export let onClickNote: ((note: string, position: Position) => void) | undefined = undefined;
	export let handleArrows: ArrowHandler | undefined = undefined;
	export let handleMouseDown: MouseDownHandler | undefined = undefined;
	export let handleMouseEnter: MouseEnterHandler | undefined = undefined;

	export let isEditor = false;
</script>

<svg
	viewBox="-2 -2 {clues.dimensions.columns * cellSize + 4} {clues.dimensions.rows * cellSize + 4}"
	class="max-h-full max-w-full"
>
	<Colors
		editorColors={clues.colors}
		gameColors={userInputs?.colors}
		dimensions={clues.dimensions}
	/>
	<g id="highlights">
		{#if wrongCells}
			{#each wrongCells as cell}
				<rect
					class="fill-current w-cell h-cell text-red-200"
					x={cellSize * cell.column}
					y={cellSize * cell.row}
					vector-effect="non-scaling-size"
				/>
			{/each}
		{/if}
		{#if selectedCells}
			{#each selectedCells as cell}
				<rect
					class="fill-current w-cell h-cell text-orange-300 text-opacity-40"
					x={cellSize * cell.column}
					y={cellSize * cell.row}
					vector-effect="non-scaling-size"
				/>
			{/each}
		{/if}
		{#if highlightedCells}
			{#each highlightedCells as cell}
				<rect
					class="fill-current w-cell h-cell text-blue-100"
					x={cellSize * cell.column}
					y={cellSize * cell.row}
					vector-effect="non-scaling-size"
				/>
			{/each}
		{/if}
	</g>

	<Interface
		cells={clues.cells}
		dimensions={clues.dimensions}
		{isEditor}
		{handleArrows}
		{handleMouseDown}
		{handleMouseEnter}
	/>
	<Paths paths={clues.paths} />
	<KillerCages cages={clues.extendedcages} dimensions={clues.dimensions} />
	<Cells cells={clues.cells} />
	<Notes notes={userInputs?.notes} {onClickNote} />
	<Regions regions={clues.regions} dimensions={clues.dimensions} />
	<BorderClues borderClues={clues.borderclues} />
	<CellClues cellClues={clues.cellclues} />
	<CornerMarks
		values={userInputs?.values}
		givens={clues.givens}
		dimensions={clues.dimensions}
		cornermarks={userInputs?.cornermarks}
	/>
	<CenterMarks
		values={userInputs?.values}
		givens={clues.givens}
		dimensions={clues.dimensions}
		centermarks={userInputs?.centermarks}
	/>
	<Numbers values={userInputs?.values} givens={clues.givens} dimensions={clues.dimensions} />
	<Logic logic={clues.logic} dimensions={clues.dimensions} />
</svg>
