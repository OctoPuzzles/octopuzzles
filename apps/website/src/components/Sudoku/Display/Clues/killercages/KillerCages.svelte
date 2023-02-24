<script lang="ts">
	import type { Dimensions, Extendedcages } from '$models/Sudoku';
	import Killercage from './Killercage.svelte';

	export let cages: Extendedcages;
	export let dimensions: Dimensions;
</script>

{#if cages.length > 0}
	<g id="killer-cages" class="select-none pointer-events-none">
		<!-- White background -->
		<defs>
			<filter x="0" y="0" width="1" height="1" id="solid">
				<feFlood flood-color="white" result="bg" />
				<feMerge>
					<feMergeNode in="bg" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
		{#each cages as cage}
			<Killercage {cage} {dimensions} />
		{/each}
	</g>
{/if}
