<script lang="ts">
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { get } from 'svelte/store';
	import deepCopy from '$utils/deepCopy';
	import Keypad from '../Keypad.svelte';
	import { undefinedIfEmpty } from '$utils/undefinedIfEmpty';

	const { selectedCells } = highlights;
	const givens = editorHistory.getClue('givens');
</script>

<Keypad
	getButtonInfo={(digit) => {
		return { class: '', custom: false };
	}}
	handleDigit={(digit) => {
		let currentCellValues = get(gameHistory.getValue('cellValues'));
		let newCellValues = deepCopy(currentCellValues);
		let positions = deepCopy(get(selectedCells));

		positions = positions.filter((p) => $givens[p.row][p.column] === '');
		if (positions.length === 0) return;

		if (digit === '') {
			const clearAllGameCells = positions.every(
				(p) => !currentCellValues[p.row][p.column].centermarks
			);
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the center marks from all selected cells
				positions.forEach((p) => {
					delete newCellValues[p.row][p.column].centermarks;
				});
			}
		} else {
			let allCellsHasCenterMark = positions.every((p) =>
				currentCellValues[p.row][p.column].centermarks?.includes(digit)
			);

			if (!allCellsHasCenterMark) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					const centermarks = currentCellValues[p.row][p.column].centermarks;
					if (centermarks) {
						if (!centermarks.includes(digit)) {
							newCellValues[p.row][p.column].centermarks = [...centermarks, digit].sort();
						}
					} else {
						newCellValues[p.row][p.column].centermarks = [digit];
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					const centermarks = currentCellValues[p.row][p.column].centermarks;
					if (centermarks) {
						newCellValues[p.row][p.column].centermarks = undefinedIfEmpty(
							centermarks.filter((s) => s !== digit)
						);
					}
				});
			}
		}

		gameHistory.set({ cellValues: newCellValues });
	}}
>
	<div slot="digit" let:digit>
		{digit}
	</div>
</Keypad>
