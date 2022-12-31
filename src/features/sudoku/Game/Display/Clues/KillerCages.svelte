<script lang="ts">
	import type { Dimensions, Extendedcages } from '$models/Sudoku';
	import Killercage from '$features/sudoku/components/display/killercages/Killercage.svelte';
	import WhiteBackground from '$features/sudoku/components/display/killercages/WhiteBackground.svelte';

	export let cages: Extendedcages;

	export let dimensions: Dimensions;
</script>

{#if cages.length > 0}
	<g id="killer-cages" class="select-none pointer-events-none">
		<WhiteBackground />
		{#each cages as cage}
			<Killercage {cage} {dimensions} />
		{/each}
	</g>
{/if}
