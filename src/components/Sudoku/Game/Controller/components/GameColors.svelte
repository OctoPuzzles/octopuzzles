<script lang="ts">
	import { gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import { colorNumberMap, numberColorMap } from '$constants';
	import Keypad from '../Keypad.svelte';

	const { selectedCells } = highlights;
</script>

<Keypad
	getButtonInfo={(digit) => {
		const color = numberColorMap[parseInt(digit)].toLowerCase();
		return { class: 'text-' + color + '-500 bg-' + color + '-500', customColor: true };
	}}
	handleDigit={(digit) => {
		const color = digit === '' ? undefined : numberColorMap[parseInt(digit)];
		const positions = get(selectedCells);
		if (positions.length === 0) return;

		const currentColors = get(gameHistory.getValue('colors'));
		const newColors = deepCopy(currentColors);

		if (color === undefined) {
			const clearAllGameCells = positions.every((p) => currentColors[p.row][p.column].length === 0);
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the colors from all selected cells
				positions.forEach((p) => {
					newColors[p.row][p.column] = [];
				});
			}
		} else {
			let allCellsHasColor = positions.every((p) => currentColors[p.row][p.column].includes(color));

			if (!allCellsHasColor) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					if (!currentColors[p.row][p.column].includes(color)) {
						newColors[p.row][p.column] = [...currentColors[p.row][p.column], color]
							.map((c) => colorNumberMap[c])
							.sort()
							.map((n) => numberColorMap[n]);
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					newColors[p.row][p.column] = currentColors[p.row][p.column].filter((c) => c !== color);
				});
			}
		}

		gameHistory.set({ colors: newColors });
	}}
/>
