<script lang="ts">
	import SquareButton from '$ui/SquareButton.svelte';
	import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
	import { isDeleteKey } from '$utils/keyboard/isDeleteKey';
	import { hasOpenModals } from '$stores/modalStore';
	import { editorHistory, gameHistory, highlights } from '$stores/sudokuStore';
	import deepCopy from '$utils/deepCopy';
	import { get } from 'svelte/store';
	import classNames from 'classnames';
	import { undefinedIfEmpty } from '$utils/undefinedIfEmpty';

	export let getButtonInfo: ((digit: string) => { class: string; custom: boolean }) | undefined =
		undefined;
	export let handleDigit: ((digit: string) => void) | undefined = undefined;

	const { selectedCells } = highlights;
	const clues = editorHistory.subscribeToClues();

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (k.key === '/' || k.key === '*') {
			handleModifier(k.key);
		} else if (handleDigit) {
			if (isDeleteKey(k)) {
				handleDigit('');
			} else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(k.key)) {
				handleDigit(k.key);
			} else if (k.code.startsWith('Digit')) {
				handleDigit(k.code.replace('Digit', ''));
			}
		}
	}

	function handleModifier(key: string): void {
		const sCells = $clues.logic.flags?.includes('SCells') ?? false;
		const doublers = $clues.logic.flags?.includes('Doublers') ?? false;

		if ((key === '/' && sCells) || (key === '*' && doublers)) {
			const givens = $clues.givens;
			const positions = get(selectedCells).filter((p) => !(givens[p.row]?.[p.column] !== ''));
			if (positions.length === 0) return;

			const currentCellValues = get(gameHistory.getValue('cellValues'));
			let newCellValues = deepCopy(currentCellValues);
			const modifier = key === '/' ? 'SCell' : 'Doubler';
			const allCellsHaveModifier = positions.every((p) =>
				currentCellValues[p.row][p.column].modifiers?.includes(modifier)
			);

			if (!allCellsHaveModifier) {
				// Add it to the cells that does not have it
				positions.forEach((p) => {
					const modifiers = currentCellValues[p.row][p.column].modifiers;
					if (modifiers) {
						if (!modifiers.includes(modifier)) {
							newCellValues[p.row][p.column].modifiers = [...modifiers, modifier];
						}
					} else {
						newCellValues[p.row][p.column].modifiers = [modifier];
					}
				});
			} else {
				// Remove it from all cells
				positions.forEach((p) => {
					const modifiers = currentCellValues[p.row][p.column].modifiers;
					if (modifiers) {
						newCellValues[p.row][p.column].modifiers = undefinedIfEmpty(
							modifiers.filter((m) => m !== modifier)
						);
					}
				});
			}

			gameHistory.set({
				cellValues: newCellValues
			});
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="w-full h-full flex justify-center items-center">
	<div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
		{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as digit}
			{@const buttonInfo = getButtonInfo
				? getButtonInfo(digit)
				: { class: 'text-3xl', custom: false }}
			<div>
				<SquareButton
					variant={buttonInfo.custom ? 'custom' : 'secondary'}
					class={buttonInfo.class}
					title={digit}
					on:click={() => {
						if (handleDigit) handleDigit(digit);
					}}><slot name="digit" {digit} /></SquareButton
				>
			</div>
		{/each}
		{#if true}
			{@const sCells = $clues.logic.flags?.includes('SCells')}
			{@const doublers = $clues.logic.flags?.includes('Doublers')}
			<div
				class={classNames({
					'col-span-2': !sCells && !doublers
				})}
			>
				<SquareButton
					class={classNames('p-3', {
						'w-36': !sCells && !doublers
					})}
					on:click={() => {
						if (handleDigit) handleDigit('');
					}}
					title="Clear"
				>
					<Backspace size={32} />
				</SquareButton>
			</div>
			{#if sCells || doublers}
				{@const key = sCells ? '/' : '*'}
				{@const title = sCells ? 'S-Cell' : 'Doubler'}
				<SquareButton class="text-3xl" on:click={() => handleModifier(key)} {title}>
					{key}
				</SquareButton>
			{/if}
		{/if}
	</div>
</div>
