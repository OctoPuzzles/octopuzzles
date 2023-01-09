<script lang="ts">
	import type { Paths } from '$models/Sudoku';
	import Path from './Path.svelte';

	export let paths: Paths;
</script>

{#if paths.length > 0}
	<g id="paths" class="opacity-60">
		{#each paths as path}
			<Path {path} />
		{/each}
	</g>
{/if}
