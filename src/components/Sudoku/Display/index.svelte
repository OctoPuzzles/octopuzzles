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

	// EDITOR STATE
	export let regions: EditorHistoryStep['regions'];
	export let editorColors: EditorHistoryStep['colors'];
	export let cells: EditorHistoryStep['cells'];
	export let cages: EditorHistoryStep['extendedcages'];
	export let givens: EditorHistoryStep['givens'];
	export let paths: EditorHistoryStep['paths'];
	export let borderClues: EditorHistoryStep['borderclues'];
	export let cellClues: EditorHistoryStep['cellclues'];
	export let dimensions: EditorHistoryStep['dimensions'];
	export let logic: EditorHistoryStep['logic'];

	export let interactive = false;

	// GAME STATE
	export let values: GameHistoryStep['values'] | null = null;
	export let gameColors: GameHistoryStep['colors'] | null = null;
	export let cornermarks: GameHistoryStep['cornermarks'] | null = null;
	export let centermarks: GameHistoryStep['centermarks'] | null = null;
	export let notes: GameHistoryStep['notes'] | null = null;
</script>

<svg
	viewBox="-2 -2 {dimensions.columns * cellSize + 4} {dimensions.rows * cellSize + 4}"
	class="max-h-full max-w-full"
>
	<Colors {editorColors} {gameColors} {dimensions} />
	<slot name="highlights" />
	<slot name="interface" />
	<Paths {paths} />
	<KillerCages {cages} {dimensions} />
	<Cells {cells} />
	<Notes {notes} />
	<Regions {regions} {dimensions} />
	<BorderClues {borderClues} />
	<CellClues {cellClues} {interactive} />
	<CornerMarks {values} {givens} {dimensions} {cornermarks} />
	<CenterMarks {values} {givens} {dimensions} {centermarks} />
	<Numbers {values} {givens} {dimensions} />
	<Logic {logic} {dimensions} />
</svg>
