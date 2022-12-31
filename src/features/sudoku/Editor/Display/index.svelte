<script lang="ts">
	import { cellSize } from '$constants';
	import type { EditorHistoryStep } from '$types';
	import BorderClues from './Clues/BorderClues.svelte';
	import CellClues from './Clues/CellClues.svelte';
	import Cells from './Clues/Cells.svelte';
	import Colors from './Clues/Colors.svelte';
	import KillerCages from './Clues/KillerCages.svelte';
	import Numbers from './Clues/Numbers.svelte';
	import Paths from './Clues/Paths.svelte';
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
</script>

<svg
	viewBox="-2 -2 {dimensions.columns * cellSize + 4} {dimensions.rows * cellSize + 4}"
	class="max-h-full max-w-full"
>
	<Colors {editorColors} {dimensions} />
	<slot name="highlights" />
	<slot name="interface" />
	<Paths {paths} />
	<KillerCages {cages} {dimensions} />
	<Cells {cells} />
	<Regions {regions} {dimensions} />
	<BorderClues {borderClues} />
	<CellClues {cellClues} />
	<Numbers {givens} {dimensions} />
	<Logic {logic} {dimensions} />
</svg>
