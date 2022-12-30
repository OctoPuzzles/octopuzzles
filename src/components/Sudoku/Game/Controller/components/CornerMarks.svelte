<script lang="ts">
	import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import { get } from 'svelte/store';
	import deepCopy from '$utils/deepCopy';
	import SquareButton from '$ui/SquareButton.svelte';
	import classNames from 'classnames';
	import { isDeleteKey } from '$utils/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';

	const { selectedCells } = highlights;

	function handleClick(newCornermark: string): void {
		let currentCornermarks = get(gameHistory.getValue('cornermarks'));
		let newCornermarks = deepCopy(currentCornermarks);
		const givens = editorHistory.getClue('givens');
		let positions = deepCopy(get(selectedCells));

		positions = positions.filter((p) => givens[p.row][p.column] === '');
		if (positions.length === 0) return;

		if (newCornermark === '') {
			const clearAllGameCells = positions.every((p) => currentCornermarks[p.row][p.column] === '');
			if (clearAllGameCells) {
				// completely clear the selected cells
				gameHistory.clearCells(positions);
				return;
			} else {
				// Remove the center marks from all selected cells
				positions.forEach((p) => {
					newCornermarks[p.row][p.column] = '';
				});
			}
		} else {
			let allCellsHasCornerMark = positions.every((p) =>
				currentCornermarks[p.row][p.column].includes(newCornermark)
			);

			if (!allCellsHasCornerMark) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					if (!currentCornermarks[p.row][p.column].includes(newCornermark)) {
						newCornermarks[p.row][p.column] = (currentCornermarks[p.row][p.column] + newCornermark)
							.split('')
							.sort()
							.join('');
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					newCornermarks[p.row][p.column] = currentCornermarks[p.row][p.column]
						.split('')
						.filter((s) => s !== newCornermark)
						.sort()
						.join('');
				});
			}
		}

		gameHistory.set({ cornermarks: newCornermarks });
	}

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (isDeleteKey(k)) {
			k.preventDefault();
			handleClick('');
		} else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(k.key)) {
			handleClick(k.key);
		} else if (k.code.startsWith('Digit')) {
			handleClick(k.code.replace('Digit', ''));
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="w-full h-full flex justify-center items-center">
	<div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
		{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as i}
			<div>
				<SquareButton variant="secondary" class="p-1" on:click={() => handleClick(String(i))}>
					<div class="w-full h-full relative">
						<p
							class={classNames('absolute', {
								'left-0': (i - 1) % 3 === 0,
								'left-1/2 -translate-x-1/2': (i - 1) % 3 === 1,
								'right-0': (i - 1) % 3 === 2,
								'top-0': Math.floor((i - 1) / 3) === 0,
								'top-1/2 -translate-y-1/2': Math.floor((i - 1) / 3) === 1,
								'bottom-0': Math.floor((i - 1) / 3) === 2,
								'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2': i === 0
							})}
						>
							{i}
						</p>
					</div>
				</SquareButton>
			</div>
		{/each}
		<div class="col-span-2">
			<SquareButton class="w-36 p-3" on:click={() => handleClick('')}>
				<Backspace size={32} />
			</SquareButton>
		</div>
	</div>
</div>
