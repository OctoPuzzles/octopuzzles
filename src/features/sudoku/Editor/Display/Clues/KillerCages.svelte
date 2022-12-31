<script lang="ts">
	import { inputMode, highlights } from '$stores/sudokuStore';
	import type { Dimensions, Extendedcage, Extendedcages } from '$models/Sudoku';
	import Killercage from '$features/sudoku/components/display/killercages/Killercage.svelte';
	import WhiteBackground from '$features/sudoku/components/display/killercages/WhiteBackground.svelte';

	const { selectedItemIndex, highlightedItemIndex, selectedCells } = highlights;
	export let cages: Extendedcages;

	export let dimensions: Dimensions;

	let hovered = -1;

	function onClick(cage: Extendedcage, i: number) {
		$inputMode = 'extendedcages';
		$selectedCells = cage.positions;
		$selectedItemIndex = i;
	}
</script>

{#if cages.length > 0}
	<g id="killer-cages">
		<WhiteBackground />
		{#each cages as cage, i}
			<Killercage
				{cage}
				{dimensions}
				isHighlighted={$inputMode === 'extendedcages' &&
					cage.color == null &&
					$highlightedItemIndex === i}
				isSelected={($inputMode === 'extendedcages' &&
					cage.color == null &&
					$selectedItemIndex === i) ||
					hovered === i}
			/>
			<Killercage
				{cage}
				{dimensions}
				isHighlighted={$inputMode === 'extendedcages' &&
					cage.color == null &&
					$highlightedItemIndex === i}
				isSelected={($inputMode === 'extendedcages' &&
					cage.color == null &&
					$selectedItemIndex === i) ||
					hovered === i}
				interactable
				on:click={() => {
					onClick(cage, i);
				}}
				on:keypress={() => {
					onClick(cage, i);
				}}
				on:mouseenter={() => (hovered = i)}
				on:mouseleave={() => (hovered = -1)}
			/>
		{/each}
	</g>
{/if}
