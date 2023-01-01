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
	export let clues: EditorHistoryStep;
</script>

<svg
	viewBox="-2 -2 {clues.dimensions.columns * cellSize + 4} {clues.dimensions.rows * cellSize + 4}"
	class="max-h-full max-w-full"
>
	<Colors colors={clues.colors} dimensions={clues.dimensions} />
	<slot name="highlights" />
	<slot name="interface" />
	<Paths paths={clues.paths} />
	<KillerCages cages={clues.extendedcages} dimensions={clues.dimensions} />
	<Cells cells={clues.cells} />
	<Regions regions={clues.regions} dimensions={clues.dimensions} />
	<BorderClues borderClues={clues.borderclues} />
	<CellClues cellClues={clues.cellclues} />
	<Numbers givens={clues.givens} dimensions={clues.dimensions} />
	<Logic logic={clues.logic} dimensions={clues.dimensions} />
</svg>
