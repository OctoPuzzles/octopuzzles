<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, EditorColors } from '$models/Sudoku';
	import arrayfrom0ToN from '$utils/arrayfrom0ToN';

	export let editorColors: EditorColors;
	export let dimensions: Dimensions;
</script>

<g id="colors" class="select-none pointer-events-none">
	{#each arrayfrom0ToN(dimensions.rows) as row}
		{#each arrayfrom0ToN(dimensions.columns) as column}
			{@const editorColor = editorColors[row][column]}
			{#if editorColor}
				<rect
					x={cellSize * column}
					y={cellSize * row}
					class="fill-current text-{editorColor.toLowerCase()} w-cell h-cell opacity-60"
					vector-effect="non-scaling-size"
				/>
			{/if}
		{/each}
	{/each}
</g>
