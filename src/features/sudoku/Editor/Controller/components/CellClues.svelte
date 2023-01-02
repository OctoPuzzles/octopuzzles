<script lang="ts">
	import {
		cellClueLocationNames,
		cellClueSizeNames,
		cellClueTypeNames,
		cellClueTypesToLabel,
		isFrameCellClue,
		rotationNames,
		symbolTypeNames
	} from '$constants';
	import type {
		Cellclue,
		CellClueLocation,
		CellClueSize,
		CellClueType,
		Position,
		Rotation,
		SymbolType
	} from '$models/Sudoku';
	import { hasOpenModals } from '$stores/modalStore';
	import { editorHistory, handleArrows, highlights, setMargins } from '$stores/sudokuStore';
	import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
	import Button from '$ui/Button.svelte';
	import ColorSelect from '$ui/ColorSelect.svelte';
	import ControllerButton from '$ui/ControllerButton.svelte';
	import Input from '$ui/Input.svelte';
	import Label from '$ui/Label.svelte';
	import OldSelect from '$ui/OldSelect.svelte';
	import deepCopy from '$utils/deepCopy';
	import { isDeleteKey } from '$utils/isDeleteKey';
	import isArrowKey from '$utils/keyboard/isArrowKey';
	import moveArrayElement from '$utils/moveArrayElement';
	import { cellClueDefaults } from '$utils/prefabs';
	import { onDestroy } from 'svelte';

	const labels = editorHistory.labels;
	const sudokuClues = editorHistory.subscribeToClues();

	let type: CellClueType | 'CUSTOM' = $sudokuClues.cellclues[0]?.type ?? 'CUSTOM';
	let defaultSettings = cellClueDefaults(type);
	let { location, text, size, symbol, rotation, color } = defaultSettings;

	$: color, updateSelectedClue();

	let input: Input;

	const cellClueTypes: CellClueType[] = [
		'Maximum',
		'Minimum',
		'LittleKillerNE',
		'LittleKillerNW',
		'LittleKillerSE',
		'LittleKillerSW',
		'Sandwich',
		'Skyscraper',
		'XSum',
		'NumberedRoom'
	];

	const symbolTypes: SymbolType[] = [
		'Diagonal',
		'Arrow',
		'SmallArrow',
		'Arrowhead',
		'InvertedArrowhead'
	];

	const cellClueLocations: CellClueLocation[] = [
		'TopLeft',
		'Top',
		'TopRight',
		'Left',
		'Center',
		'Right',
		'BottomLeft',
		'Bottom',
		'BottomRight'
	];

	const cellClueSizes: CellClueSize[] = ['Large', 'Medium', 'Small', 'XSmall'];

	const symbolRotations: Rotation[] = [
		'NorthWest',
		'North',
		'NorthEast',
		'East',
		'SouthEast',
		'South',
		'SouthWest',
		'West'
	];

	$: if ($highlights.selectedItemIndex >= 0) {
		cellClueSelected($highlights.selectedItemIndex);
	}

	function cellClueSelected(selectedItemIndex: number): void {
		updateSettings($sudokuClues.cellclues[selectedItemIndex]);
	}

	function updateSettings(clue: Partial<Cellclue>) {
		type = clue.type ?? 'CUSTOM';
		defaultSettings = cellClueDefaults(type);
		text = clue.text ?? defaultSettings.text;
		location = clue.location ?? defaultSettings.location;
		size = clue.size ?? defaultSettings.size;
		symbol = clue.symbol ?? defaultSettings.symbol;
		rotation = clue.rotation ?? defaultSettings.rotation;
		color = clue.color ?? defaultSettings.color;
	}

	function changeType(type: CellClueType | 'CUSTOM') {
		if (type !== 'CUSTOM' && isFrameCellClue[type]) {
			setMargins({
				left: Math.max(1, $sudokuClues.dimensions.margins?.left ?? 0),
				right: Math.max(1, $sudokuClues.dimensions.margins?.right ?? 0),
				top: Math.max(1, $sudokuClues.dimensions.margins?.top ?? 0),
				bottom: Math.max(1, $sudokuClues.dimensions.margins?.bottom ?? 0)
			});
		} else {
			resetMargins();
		}

		updateSettings(type !== 'CUSTOM' ? { type } : {});

		updateSelectedClue();
	}

	function resetMargins() {
		setMargins({
			left: Math.max(
				$sudokuClues.cellclues.some(
					(clue) => clue.position.column < ($sudokuClues.dimensions.margins?.left ?? 0)
				)
					? 1
					: 0,
				$sudokuClues.dimensions.margins?.left ?? 0
			),
			right: Math.max(
				$sudokuClues.cellclues.some(
					(clue) =>
						clue.position.column >=
						$sudokuClues.dimensions.columns - ($sudokuClues.dimensions.margins?.right ?? 0)
				)
					? 1
					: 0,
				$sudokuClues.dimensions.margins?.right ?? 0
			),
			top: Math.max(
				$sudokuClues.cellclues.some(
					(clue) => clue.position.row < ($sudokuClues.dimensions.margins?.top ?? 0)
				)
					? 1
					: 0,
				$sudokuClues.dimensions.margins?.top ?? 0
			),
			bottom: Math.max(
				$sudokuClues.cellclues.some(
					(clue) =>
						clue.position.row >=
						$sudokuClues.dimensions.rows - ($sudokuClues.dimensions.margins?.bottom ?? 0)
				)
					? 1
					: 0,
				$sudokuClues.dimensions.margins?.bottom ?? 0
			)
		});
	}

	$: canMakeNewCellClue = $highlights.selectedCells.length === 1;

	function newCellClue(position: Position): Cellclue {
		return {
			position,
			type: type !== 'CUSTOM' ? type : undefined,
			text:
				symbol === 'NONE' && (type === 'CUSTOM' || text != defaultSettings.text) ? text : undefined,
			location:
				symbol === 'NONE' && (type === 'CUSTOM' || location !== defaultSettings.location)
					? location
					: undefined,
			size:
				symbol === 'NONE' && (type === 'CUSTOM' || size != defaultSettings.size) ? size : undefined,
			symbol:
				(type === 'CUSTOM' || symbol !== defaultSettings.symbol) && symbol != 'NONE'
					? symbol
					: undefined,
			rotation:
				symbol !== 'NONE' && (type === 'CUSTOM' || rotation !== defaultSettings.rotation)
					? rotation
					: undefined,
			color: type === 'CUSTOM' || color !== defaultSettings.color ? color : undefined
		};
	}

	const createNewCellClue = (): void => {
		editorHistory.set({
			cellclues: [...deepCopy($sudokuClues.cellclues), newCellClue($highlights.selectedCells[0])]
		});
		$highlights.selectedItemIndex = $sudokuClues.cellclues.length - 1;

		addLabel();
	};

	function addLabel() {
		if (type !== 'CUSTOM') {
			const label = $labels.find(
				(l) => l.label.name === cellClueTypesToLabel[type as CellClueType]
			);
			if (label) {
				label.selected = true;
			}
		}
	}

	const updateSelectedClue = (): void => {
		if ($highlights.selectedItemIndex === -1) return;

		let newCellClues: Cellclue[] = [];
		$sudokuClues.cellclues.forEach((cellClue, i) => {
			if (i !== $highlights.selectedItemIndex) {
				newCellClues = [...newCellClues, cellClue];
			} else {
				newCellClues = [...newCellClues, newCellClue(cellClue.position)];

				if (type !== cellClue.type) {
					addLabel();
				}
			}
		});
		editorHistory.set({ cellclues: newCellClues });
	};

	const deleteCellClueAtIndex = (index: number): void => {
		const newCellClues = $sudokuClues.cellclues.filter((_, i) => index !== i);
		highlights.reset();
		editorHistory.set({ cellclues: newCellClues });
	};

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (!isArrowKey(k.key)) {
			input.focus();
		}

		if (isDeleteKey(k) && $highlights.selectedItemIndex >= 0 && text === '') {
			// The input needs to handle backspace on empty input-field as well
			deleteCellClueAtIndex($highlights.selectedItemIndex);
		}

		if (k.key === 'Enter') {
			createNewCellClue();
		}
	}

	const reorderCellClue = (index: number, way: 'up' | 'down'): void => {
		let newCellClues: Cellclue[] = [];
		if (way === 'up') {
			if (index === 0) return;
			newCellClues = moveArrayElement($sudokuClues.cellclues, index, index - 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			} else if (index - 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			}
		} else if (way === 'down') {
			if (index === $sudokuClues.cellclues.length - 1) return;
			newCellClues = moveArrayElement($sudokuClues.cellclues, index, index + 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			} else if (index + 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			}
		}
		editorHistory.set({ cellclues: newCellClues });
	};

	onDestroy(() => {
		resetMargins();
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
	<div class="px-2 flex flex-col gap-1 overflow-hidden justify-between">
		<div
			class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
		>
			<div class="h-full overflow-y-auto w-full">
				{#each $sudokuClues.cellclues as cellClue, index (index)}
					<ControllerButton
						onHover={() => {
							highlights.set({
								highlightedCells: [cellClue.position],
								highlightedItemIndex: index
							});
						}}
						onHoverOut={() => {
							highlights.set({ highlightedCells: [], highlightedItemIndex: -1 });
						}}
						isHighlighted={index === $highlights.selectedItemIndex}
						onClick={() => {
							highlights.set({ selectedCells: [cellClue.position], selectedItemIndex: index });
						}}
						onDelete={() => deleteCellClueAtIndex(index)}
						onMoveUp={() => reorderCellClue(index, 'up')}
						onMoveDown={() => reorderCellClue(index, 'down')}
					>
						{cellClue.type ? cellClueTypeNames[cellClue.type] : 'Custom'}
					</ControllerButton>
				{/each}
			</div>
		</div>

		<Button
			variant="secondary"
			class="w-full"
			disabled={!canMakeNewCellClue}
			on:click={createNewCellClue}
		>
			<span class="text-sm">New Cell clue from selection</span>
		</Button>
	</div>

	<div class="px-2 flex flex-col">
		<div>
			<OldSelect
				label="Type"
				on:change={() => changeType(type)}
				id="type"
				bind:value={type}
				class="mr-0.5 w-full capitalize"
			>
				{#each cellClueTypes as cellClueType}
					<option value={cellClueType} class="capitalize">{cellClueTypeNames[cellClueType]}</option>
				{/each}
				<option value={'CUSTOM'} class="capitalize">Custom</option>
			</OldSelect>
		</div>
		<div>
			<ColorSelect bind:color class="w-full" />
		</div>
		<div>
			<OldSelect
				label="Symbol"
				on:change={updateSelectedClue}
				id="symbol"
				bind:value={symbol}
				class="mr-0.5 w-full capitalize"
			>
				<option value={'NONE'} class="capitalize">Text</option>
				{#each symbolTypes as symbolType}
					<option value={symbolType} class="capitalize">{symbolTypeNames[symbolType]}</option>
				{/each}
			</OldSelect>
		</div>
		{#if symbol.toString() == 'NONE'}
			<div>
				<Label id="value">Value</Label>
				<Input
					bind:this={input}
					maxlength={4}
					placeholder="Text"
					bind:value={text}
					autocomplete="off"
					name="text"
					id="text"
					on:input={() => updateSelectedClue()}
					on:focus={() => {
						// eslint-disable-next-line @typescript-eslint/no-empty-function
						$handleArrows = () => {};
					}}
					on:blur={() => {
						$handleArrows = defaultHandleArrows;
					}}
				/>
			</div>
			<div>
				<OldSelect
					label="Location"
					on:change={() => updateSelectedClue()}
					id="location"
					bind:value={location}
					class="mr-0.5 w-full capitalize"
				>
					{#each cellClueLocations as cellClueLocation}
						<option value={cellClueLocation} class="capitalize"
							>{cellClueLocationNames[cellClueLocation]}</option
						>
					{/each}
				</OldSelect>
			</div>
			<div>
				<OldSelect
					label="Size"
					on:change={() => updateSelectedClue()}
					id="size"
					bind:value={size}
					class="mr-0.5 w-full capitalize"
				>
					{#each cellClueSizes as cellClueSize}
						<option value={cellClueSize} class="capitalize"
							>{cellClueSizeNames[cellClueSize]}</option
						>
					{/each}
				</OldSelect>
			</div>
		{/if}
		{#if symbol.toString() != 'NONE'}
			<div>
				<OldSelect
					label="Orientation"
					on:change={() => updateSelectedClue()}
					id="rotation"
					bind:value={rotation}
					class="mr-0.5 w-full capitalize"
				>
					{#each symbolRotations as symbolRotation}
						<option value={symbolRotation} class="capitalize"
							>{rotationNames[symbolRotation]}</option
						>
					{/each}
				</OldSelect>
			</div>
		{/if}
	</div>
</div>
