<script lang="ts">
	import { cellSize } from '$constants';
	import type { EditorHistoryStep, GameHistoryStep } from '$types';
	import BorderClues from './Clues/BorderClues.svelte';
	import CellClues from './Clues/CellClues.svelte';
	import Cells from './Clues/Cells.svelte';
	import Colors from './Clues/Colors.svelte';
	import CornerMarks from './Clues/CornerMarks.svelte';
	import CenterMarks from './Clues/CenterMarks.svelte';
	import KillerCages from './Clues/KillerCages.svelte';
	import Numbers from './Clues/Numbers.svelte';
	import Paths from './Clues/Paths.svelte';
	import Notes from './Clues/Notes.svelte';
	import Logic from './Clues/Logic.svelte';
	import Regions from './Clues/Regions.svelte';

	// EDITOR STATE
	export let clues: EditorHistoryStep;

	// GAME STATE
	export let values: GameHistoryStep['values'];
	export let gameColors: GameHistoryStep['colors'];
	export let cornermarks: GameHistoryStep['cornermarks'];
	export let centermarks: GameHistoryStep['centermarks'];
	export let notes: GameHistoryStep['notes'];
</script>

<svg
	viewBox="-2 -2 {clues.dimensions.columns * cellSize + 4} {clues.dimensions.rows * cellSize + 4}"
	class="max-h-full max-w-full"
>
	<Colors editorColors={clues.colors} {gameColors} dimensions={clues.dimensions} />
	<slot name="highlights" />
	<slot name="interface" />
	<Paths paths={clues.paths} />
	<KillerCages cages={clues.extendedcages} dimensions={clues.dimensions} />
	<Cells cells={clues.cells} />
	<Notes {notes} />
	<Regions regions={clues.regions} dimensions={clues.dimensions} />
	<BorderClues borderClues={clues.borderclues} />
	<CellClues cellClues={clues.cellclues} />
	<CornerMarks {values} givens={clues.givens} dimensions={clues.dimensions} {cornermarks} />
	<CenterMarks {values} givens={clues.givens} dimensions={clues.dimensions} {centermarks} />
	<Numbers {values} givens={clues.givens} dimensions={clues.dimensions} />
	<Logic logic={clues.logic} dimensions={clues.dimensions} />
</svg>
