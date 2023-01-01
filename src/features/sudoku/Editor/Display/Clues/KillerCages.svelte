<script lang="ts">
	import { inputMode, highlights } from '$stores/sudokuStore';
	import type { Dimensions, Extendedcage, Extendedcages } from '$models/Sudoku';
	import Killercage from '$features/sudoku/components/display/killercages/Killercage.svelte';
	import WhiteBackground from '$features/sudoku/components/display/killercages/WhiteBackground.svelte';

	const { selectedItemIndex, selectedCells } = highlights;
	export let cages: Extendedcages;

	export let dimensions: Dimensions;

	function onClick(cage: Extendedcage, i: number) {
		$inputMode = 'extendedcages';
		$selectedCells = cage.positions;
		$selectedItemIndex = i;
	}
</script>

{#if cages.length > 0}
	<g id="killer-cages">
		<WhiteBackground />
		{#each cages as cage, i}
			<Killercage {cage} {dimensions} />
			<Killercage
				{cage}
				{dimensions}
				onClick={() => {
					onClick(cage, i);
				}}
			/>
		{/each}
	</g>
{/if}
