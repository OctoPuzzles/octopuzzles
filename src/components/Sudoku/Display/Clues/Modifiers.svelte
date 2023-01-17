<script lang="ts">
	import { cellSize } from '$constants';
	import type { CellModifiers } from '$models/Sudoku';

	export let modifiers: CellModifiers | undefined;
</script>

{#if modifiers}
	<g id="modifiers">
		{#each modifiers as modifier}
			<g class="pointer-events-none">
				{#if modifier.type === 'SCell'}
					<line
						x1={cellSize * (modifier.position.column + 0.1)}
						y1={cellSize * (modifier.position.row + 0.9)}
						x2={cellSize * (modifier.position.column + 0.9)}
						y2={cellSize * (modifier.position.row + 0.1)}
						class={`stroke-current stroke-5 cursor text-gray`}
						stroke-linecap="round"
					/>
				{:else if modifier.type === 'Doubler'}
					<text
						x={cellSize * (modifier.position.column + 0.88)}
						y={cellSize * (modifier.position.row + 0.92)}
						dominant-baseline="middle"
						class="fill-current text-blue-700 select-none"
					>
						{'x' + (modifier.value ?? '2')}
					</text>
				{/if}
			</g>
		{/each}
	</g>
{/if}

<style>
	text {
		font-size: 0.5rem;
		text-anchor: middle;
	}
</style>
