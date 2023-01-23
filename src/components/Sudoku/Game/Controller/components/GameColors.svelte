<script lang="ts">
	import { gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { colorNumberMap, numberColorMap } from '$constants';
	import Keypad from '../Keypad.svelte';
	import { undefinedIfEmpty } from '$utils/undefinedIfEmpty';

	const { selectedCells } = highlights;
</script>

<Keypad
	getButtonInfo={(digit) => {
		const color = numberColorMap[parseInt(digit)].toLowerCase();
		return { class: 'text-' + color + '-500 bg-' + color + '-500', custom: true };
	}}
	handleDigit={(digit) => {
		const color = digit === '' ? undefined : numberColorMap[parseInt(digit)];
		const positions = get(selectedCells);
		if (positions.length === 0) return;

		const currentCellValues = get(gameHistory.getValue('cellValues'));
		const newCellValues = deepCopy(currentCellValues);

		if (color === undefined) {
			const clearAllGameCells = positions.every((p) => !currentCellValues[p.row][p.column].colors);
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the colors from all selected cells
				positions.forEach((p) => {
					delete newCellValues[p.row][p.column].colors;
				});
			}
		} else {
			let allCellsHasColor = positions.every((p) =>
				currentCellValues[p.row][p.column].colors?.includes(color)
			);

			if (!allCellsHasColor) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					const colors = currentCellValues[p.row][p.column].colors;
					if (colors) {
						if (!colors.includes(color)) {
							newCellValues[p.row][p.column].colors = [...colors, color]
								.map((c) => colorNumberMap[c])
								.sort()
								.map((n) => numberColorMap[n]);
						}
					} else {
						newCellValues[p.row][p.column].colors = [color];
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					const colors = currentCellValues[p.row][p.column].colors;
					if (colors) {
						newCellValues[p.row][p.column].colors = undefinedIfEmpty(
							colors.filter((c) => c !== color)
						);
					}
				});
			}
		}

		gameHistory.set({ cellValues: newCellValues });
	}}
/>
