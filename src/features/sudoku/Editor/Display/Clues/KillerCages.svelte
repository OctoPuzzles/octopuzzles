<script lang="ts">
	import { highlights } from '$stores/sudokuStore';
	import type { Dimensions, Extendedcage, Extendedcages } from '$models/Sudoku';
	import Killercage from '$features/sudoku/components/display/killercages/Killercage.svelte';
	import WhiteBackground from '$features/sudoku/components/display/killercages/WhiteBackground.svelte';

	export let cages: Extendedcages;

	export let dimensions: Dimensions;

	function onClick(cage: Extendedcage, i: number) {
		highlights.set({
			selectedItemIndex: i,
			inputMode: 'extendedcages',
			selectedCells: cage.positions
		});
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
