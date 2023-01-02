<script lang="ts">
	import Path from '$features/sudoku/components/display/paths/Path.svelte';
	import type { Paths } from '$models/Sudoku';
	import { highlights } from '$stores/sudokuStore';

	export let paths: Paths;
</script>

{#if paths.length > 0}
	<g id="paths" class="opacity-60">
		{#each paths as path, i}
			<Path
				{path}
				onClick={() => {
					highlights.set({
						inputMode: 'paths',
						selectedCells: path.positions,
						selectedItemIndex: i
					});
				}}
			/>
		{/each}
	</g>
{/if}
