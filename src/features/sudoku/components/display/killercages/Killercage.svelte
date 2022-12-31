<script lang="ts">
	import { cellSize } from '$constants';
	import type { Dimensions, Extendedcage } from '$models/Sudoku';
	import { createEdges } from '$utils/createEdges';
	import { topLeftOfPositions } from '$utils/topLeftOfPositions';
	import classNames from 'classnames';

	export let cage: Extendedcage;
	export let dimensions: Dimensions;
	export let isSelected = false;
	export let isHighlighted = false;
	export let interactable = false;

	const topLeft = topLeftOfPositions(cage.positions);
</script>

<g>
	{#each createEdges(cage.positions, dimensions, 0.1) as edge}
		<line
			id="display"
			class:interactable
			class:notinteractable={!interactable}
			class={classNames(
				`stroke-current`,
				interactable
					? 'text-transparent cursor-pointer'
					: {
							[`text-${cage.color?.toLowerCase()}`]: cage.color != null,
							'text-blue-700': isHighlighted,
							'text-orange-600': isSelected
					  }
			)}
			on:click
			on:keypress
			on:mouseenter
			on:mouseleave
			x1={edge.x1 * cellSize}
			y1={edge.y1 * cellSize}
			x2={edge.x2 * cellSize}
			y2={edge.y2 * cellSize}
		/>
	{/each}
	{#if cage.text && cage.text.length > 0}
		<text
			class={classNames('stroke-current', {
				[`text-${cage.color?.toLowerCase()}`]: cage.color != null,
				'text-blue-700': isHighlighted,
				'text-orange-600': isSelected
			})}
			x={cellSize * topLeft.column + 2}
			y={cellSize * topLeft.row + 2}
			width={cellSize}
			height={cellSize}
			filter="url(#solid)"
			dominant-baseline="hanging">{cage.text}</text
		>
	{/if}
</g>

<style>
	line.notinteractable {
		stroke-dasharray: 3 5;
		stroke-width: 1.5px;
		stroke-linecap: square;
	}
	line.interactable {
		stroke-width: 3px;
	}

	text {
		font-size: 0.75rem;
	}
</style>
