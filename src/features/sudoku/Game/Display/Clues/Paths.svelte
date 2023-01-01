<script lang="ts">
	import Path from '$features/sudoku/components/display/paths/Path.svelte';
	import type { Paths } from '$models/Sudoku';

	export let paths: Paths;
</script>

{#if paths.length > 0}
	<g id="paths" class="select-none pointer-events-none opacity-60">
		{#each paths as path}
			<Path {path} />
		{/each}
	</g>
{/if}
