<script lang="ts">
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { get } from 'svelte/store';
	import deepCopy from '$utils/deepCopy';
	import Keypad from '../Keypad.svelte';

	const { selectedCells } = highlights;
</script>

<Keypad
	getButtonInfo={(digit) => {
		return { class: '', customColor: false };
	}}
	handleDigit={(digit) => {
		let currentCentermarks = get(gameHistory.getValue('centermarks'));
		let newCentermarks = deepCopy(currentCentermarks);
		const givens = editorHistory.getClue('givens');
		let positions = deepCopy(get(selectedCells));

		positions = positions.filter((p) => givens[p.row][p.column] === '');
		if (positions.length === 0) return;

		if (digit === '') {
			const clearAllGameCells = positions.every((p) => currentCentermarks[p.row][p.column] === '');
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the center marks from all selected cells
				positions.forEach((p) => {
					newCentermarks[p.row][p.column] = '';
				});
			}
		} else {
			let allCellsHasCenterMark = positions.every((p) =>
				currentCentermarks[p.row][p.column].includes(digit)
			);

			if (!allCellsHasCenterMark) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					if (!currentCentermarks[p.row][p.column].includes(digit)) {
						newCentermarks[p.row][p.column] = (currentCentermarks[p.row][p.column] + digit)
							.split('')
							.sort()
							.join('');
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					newCentermarks[p.row][p.column] = currentCentermarks[p.row][p.column]
						.split('')
						.filter((s) => s !== digit)
						.join('');
				});
			}
		}

		gameHistory.set({ centermarks: newCentermarks });
	}}
>
	<div slot="digit" let:digit>
		{digit}
	</div>
</Keypad>
