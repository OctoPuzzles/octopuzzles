<script lang="ts">
	import Cellclue from '$features/sudoku/components/display/cellclues/Cellclue.svelte';
	import type { Cellclues } from '$models/Sudoku';

	export let cellClues: Cellclues;
</script>

{#if cellClues.length > 0}
	<g id="cellclues">
		{#each cellClues as cellclue}
			<Cellclue {cellclue} />
		{/each}
	</g>
{/if}
