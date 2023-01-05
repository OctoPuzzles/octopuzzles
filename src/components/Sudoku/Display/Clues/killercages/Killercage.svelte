<script lang="ts">
	import { cellSize } from '$constants';
	import classNames from 'classnames';
	import { topLeftOfPositions } from '$utils/topLeftOfPositions';
	import { createEdges } from '$utils/createEdges';
	import type { Dimensions, Extendedcage } from '$models/Sudoku';

	export let cage: Extendedcage;
	export let dimensions: Dimensions;

	$: topLeft = topLeftOfPositions(cage.positions);
</script>

{#each createEdges(cage.positions, dimensions, 0.1) as edge}
	<line
		class={classNames('stroke-current', cage.color != null && `text-${cage.color?.toLowerCase()}`)}
		x1={edge.x1 * cellSize}
		y1={edge.y1 * cellSize}
		x2={edge.x2 * cellSize}
		y2={edge.y2 * cellSize}
	/>
{/each}
{#if cage.text && cage.text.length > 0}
	<text
		class={classNames('stroke-current', cage.color != null && `text-${cage.color?.toLowerCase()}`)}
		x={cellSize * topLeft.column + 2}
		y={cellSize * topLeft.row + 2}
		width={cellSize}
		height={cellSize}
		filter="url(#solid)"
		dominant-baseline="hanging">{cage.text}</text
	>
{/if}

<style>
	line {
		stroke-dasharray: 3 5;
		stroke-width: 1.5px;
		stroke-linecap: square;
	}
	text {
		font-size: 0.75rem;
	}
</style>
