<script lang="ts">
	import Button from '$ui/Button.svelte';
	import { editorHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { isDeleteKey } from '$utils/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';

	const { selectedCells } = highlights;

	function handleClick(b: boolean): void {
		const newCells = deepCopy(editorHistory.getClue('cells'));
		if ($selectedCells.length > 0) {
			$selectedCells.forEach((cell) => {
				newCells[cell.row][cell.column] = b;
			});
			editorHistory.set({
				cells: newCells
			});
		}
	}

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (isDeleteKey(k)) {
			handleClick(false);
		} else if (k.key === 'Enter') {
			handleClick(true);
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="flex flex-col gap-2 justify-center h-full w-full p-2">
	<Button color="blue" on:click={() => handleClick(false)}>Remove selected cells</Button>
	<Button color="blue" class="mt-1" on:click={() => handleClick(true)}>Add selected cells</Button>
</div>
