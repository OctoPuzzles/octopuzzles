<script lang="ts">
	import Borderclue from '$features/sudoku/components/display/borderclues/Borderclue.svelte';
	import type { Borderclues } from '$models/Sudoku';

	export let borderClues: Borderclues;
</script>

{#if borderClues.length > 0}
	<g id="borderclues">
		{#each borderClues as borderclue}
			<Borderclue {borderclue} />
		{/each}
	</g>
{/if}
