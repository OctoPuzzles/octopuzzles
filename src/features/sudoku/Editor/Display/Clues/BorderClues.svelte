<script lang="ts">
	import Borderclue from '$features/sudoku/components/display/borderclues/Borderclue.svelte';
	import type { Borderclues } from '$models/Sudoku';
	import { highlights, inputMode } from '$stores/sudokuStore';

	const { selectedItemIndex } = highlights;
	export let borderClues: Borderclues;

	function onClick(index: number) {
		$inputMode = 'borderclues';
		$selectedItemIndex = index;
	}
</script>

{#if borderClues.length > 0}
	<g id="borderclues">
		{#each borderClues as borderclue, i}
			<Borderclue {borderclue} onClick={() => onClick(i)} />
		{/each}
	</g>
{/if}
