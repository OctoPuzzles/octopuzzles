<script lang="ts">
	import { borderClueTypesToLabel } from '$constants';
	import { default as BorderclueComponent } from '$features/sudoku/components/display/borderclues/Borderclue.svelte';
	import ScaledSvg from '$features/sudoku/components/display/ScaledSvg.svelte';
	import type { Borderclue, BorderClueType, Position } from '$models/Sudoku';
	import { shapes } from '$models/Sudoku';
	import { hasOpenModals } from '$stores/modalStore';
	import { editorHistory, handleArrows, highlights } from '$stores/sudokuStore';
	import { defaultHandleArrows } from '$stores/sudokuStore/interactionHandlers';
	import Button from '$ui/Button.svelte';
	import ColorSelect from '$ui/ColorSelect.svelte';
	import ControllerButton from '$ui/ControllerButton.svelte';
	import Input from '$ui/Input.svelte';
	import Label from '$ui/Label.svelte';
	import RadioGroup from '$ui/RadioGroup.svelte';
	import Select from '$ui/Select.svelte';
	import deepCopy from '$utils/deepCopy';
	import { isDeleteKey } from '$utils/isDeleteKey';
	import isArrowKey from '$utils/keyboard/isArrowKey';
	import moveArrayElement from '$utils/moveArrayElement';
	import { borderClueDefaults } from '$utils/prefabs';

	const sudokuClues = editorHistory.subscribeToClues();
	const labels = editorHistory.labels;

	let type: BorderClueType | 'CUSTOM' = $sudokuClues.borderclues[0]?.type ?? 'CUSTOM';
	let defaultSettings = borderClueDefaults(type);
	let { shape, color, radius, text } = defaultSettings;

	$: color, shape, updateSelectedClue();

	let input: Input;

	const borderClueTypes: BorderClueType[] = [
		'KropkiWhite',
		'KropkiBlack',
		'XvX',
		'XvV',
		'Inequality',
		'Quadruple',
		'Border'
	];

	const borderClueTypeNames: Record<BorderClueType | 'CUSTOM', string> = {
		Inequality: 'Inequality',
		KropkiBlack: 'Kropki (Black)',
		KropkiWhite: 'Kropki (White)',
		Quadruple: 'Quadruple',
		XvV: 'XV (V)',
		XvX: 'XV (X)',
		Border: 'Border',
		CUSTOM: 'Custom'
	};

	const borderClueTypesWithCustom: (BorderClueType | 'CUSTOM')[] = [...borderClueTypes, 'CUSTOM'];

	$: if ($highlights.selectedItemIndex >= 0 && $highlights.inputMode === 'borderclues') {
		borderClueSelected($highlights.selectedItemIndex);
	}

	function borderClueSelected(selectedItemIndex: number): void {
		updateSettings($sudokuClues.borderclues[selectedItemIndex]);
	}

	function updateSettings(clue: Partial<Borderclue>) {
		type = clue.type ?? 'CUSTOM';
		defaultSettings = borderClueDefaults(clue.type ?? undefined);
		shape = clue.shape ?? defaultSettings.shape;
		color = clue.color ?? defaultSettings.color;
		radius = clue.radius ?? defaultSettings.radius;
		text = clue.text ?? defaultSettings.text;
	}

	$: type, changeType(type);
	function changeType(type: BorderClueType | 'CUSTOM'): void {
		updateSettings(type !== 'CUSTOM' ? { type } : {});

		updateSelectedClue();
	}

	$: verticalOffset =
		$highlights.selectedCells.length <= 1
			? 0
			: $highlights.selectedCells.reduce((prev, curr) => {
					return prev.row >= curr.row ? prev : curr;
			  }).row -
			  $highlights.selectedCells.reduce((prev, curr) => {
					return prev.row <= curr.row ? prev : curr;
			  }).row;

	$: horizontalOffset =
		$highlights.selectedCells.length <= 1
			? 0
			: $highlights.selectedCells.reduce((prev, curr) => {
					return prev.column >= curr.column ? prev : curr;
			  }).column -
			  $highlights.selectedCells.reduce((prev, curr) => {
					return prev.column <= curr.column ? prev : curr;
			  }).column;

	$: canMakeNewBorderClue =
		$highlights.selectedCells.length >= 2 &&
		$highlights.selectedCells.length <= 4 &&
		verticalOffset <= 1 &&
		horizontalOffset <= 1;

	function newBorderClue(positions: [Position, Position]): Borderclue {
		return {
			positions,
			type: type !== 'CUSTOM' ? type : undefined,
			shape: type === 'CUSTOM' || shape != defaultSettings.shape ? shape : undefined,
			text: type === 'CUSTOM' || text != defaultSettings.text ? text : undefined,
			radius: type === 'CUSTOM' || radius != defaultSettings.radius ? radius : undefined,
			color:
				(type === 'CUSTOM' || color != defaultSettings.color) && color !== 'NONE'
					? color
					: undefined
		};
	}

	const createNewBorderClue = (): void => {
		if (!canMakeNewBorderClue) return;

		let positions = $highlights.selectedCells;
		if (positions.length > 2) {
			let p = positions[0];
			let q = positions.find((q) => q.row !== p.row && q.column !== p.column);
			if (q == null) {
				p = positions[1];
				q = positions.find((q) => q.row !== p.row && q.column !== p.column);
			}
			if (q) {
				positions = [p, q];
			}
		}

		editorHistory.set({
			borderclues: [
				...deepCopy($sudokuClues.borderclues),
				newBorderClue(positions as [Position, Position])
			]
		});
		$highlights.selectedCells = positions;
		$highlights.selectedItemIndex = $sudokuClues.borderclues.length - 1;

		addLabel();
	};

	function addLabel() {
		if (type !== 'CUSTOM') {
			const label = $labels.find(
				(l) => l.label.name === borderClueTypesToLabel[type as BorderClueType]
			);
			if (label) {
				label.selected = true;
			}
		}
	}

	const updateSelectedClue = (): void => {
		if ($highlights.selectedItemIndex === -1) return;

		let newBorderClues: Borderclue[] = [];
		$sudokuClues.borderclues.forEach((borderClue, i) => {
			if (i !== $highlights.selectedItemIndex) {
				newBorderClues = [...newBorderClues, borderClue];
			} else {
				newBorderClues = [
					...newBorderClues,
					newBorderClue(borderClue.positions as [Position, Position])
				];

				if (type !== borderClue.type) {
					addLabel();
				}
			}
		});
		editorHistory.set({ borderclues: newBorderClues });
	};

	const deleteBorderClueAtIndex = (index: number): void => {
		const newBorderClues = $sudokuClues.borderclues.filter((_, i) => index !== i);
		highlights.reset();
		editorHistory.set({ borderclues: newBorderClues });
	};

	function handleKeyDown(k: KeyboardEvent): void {
		//do not accept keyboard input when any modal controls are open
		if (hasOpenModals()) return;

		if (!isArrowKey(k.key)) {
			input.focus();
		}

		if (isDeleteKey(k) && $highlights.selectedItemIndex >= 0 && text === '') {
			// The input needs to handle backspace on empty input-field as well
			deleteBorderClueAtIndex($highlights.selectedItemIndex);
		}

		if (k.key === 'Enter') {
			createNewBorderClue();
		}
	}

	const reorderBorderClue = (index: number, way: 'up' | 'down'): void => {
		let newBorderClues: Borderclue[] = [];
		if (way === 'up') {
			if (index === 0) return;
			newBorderClues = moveArrayElement($sudokuClues.borderclues, index, index - 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			} else if (index - 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			}
		} else if (way === 'down') {
			if (index === $sudokuClues.borderclues.length - 1) return;
			newBorderClues = moveArrayElement($sudokuClues.borderclues, index, index + 1);
			if (index === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex + 1 });
			} else if (index + 1 === $highlights.selectedItemIndex) {
				highlights.set({ selectedItemIndex: $highlights.selectedItemIndex - 1 });
			}
		}
		editorHistory.set({ borderclues: newBorderClues });
	};
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="grid grid-cols-2 w-full h-full p-2">
	<div class="px-2 flex flex-col gap-1 overflow-hidden justify-between">
		<div
			class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
		>
			<div class="h-full overflow-y-auto w-full">
				{#each $sudokuClues.borderclues as borderClue, index (index)}
					<ControllerButton
						onHover={() => {
							highlights.set({
								highlightedCells: borderClue.positions,
								highlightedItemIndex: index
							});
						}}
						onHoverOut={() => {
							highlights.set({ highlightedCells: [], highlightedItemIndex: -1 });
						}}
						isHighlighted={index === $highlights.selectedItemIndex}
						onClick={() => {
							highlights.set({ selectedCells: borderClue.positions, selectedItemIndex: index });
						}}
						onDelete={() => deleteBorderClueAtIndex(index)}
						onMoveUp={() => reorderBorderClue(index, 'up')}
						onMoveDown={() => reorderBorderClue(index, 'down')}
					>
						<ScaledSvg>
							<BorderclueComponent borderclue={borderClue} />
						</ScaledSvg>
					</ControllerButton>
				{/each}
			</div>
		</div>

		<Button
			variant="secondary"
			class="w-full"
			disabled={!canMakeNewBorderClue}
			on:click={createNewBorderClue}
		>
			<span class="text-sm">New Border clue from selection</span>
		</Button>
	</div>

	<div class="px-2 flex flex-col">
		<div>
			<Select options={borderClueTypesWithCustom} bind:option={type}>
				<svelte:fragment slot="label">Type</svelte:fragment>
				<div slot="option" let:option class="capitalize">
					{borderClueTypeNames[option]}
				</div>
			</Select>
		</div>

		<div>
			<ColorSelect bind:color allowNone={true} class="w-full" />
		</div>

		<div>
			<Label id="shape">Shape</Label>
			<RadioGroup
				name="shape"
				idFromOption={(o) => o}
				options={shapes}
				bind:value={shape}
				let:option
			>
				<ScaledSvg>
					<BorderclueComponent
						borderclue={{
							color: color == 'NONE' ? 'Black' : color,
							positions: [
								{ row: 0, column: 0 },
								{ row: 0, column: 1 }
							],
							radius: 10,
							shape: option
						}}
					/>
				</ScaledSvg>
			</RadioGroup>
		</div>

		<div>
			<Label id="radius">Radius</Label>
			<div class="flex w-full">
				<input
					class="w-5/6 mr-2"
					id="radius"
					type="range"
					min={5}
					max={100}
					step={1}
					bind:value={radius}
					on:change={() => {
						updateSelectedClue();
					}}
				/>
				<span class="text-right w-1/6">{radius}</span>
			</div>
		</div>

		<div>
			<Label id="text">Text</Label>
			<Input
				bind:this={input}
				maxlength={type !== 'Quadruple' ? 4 : 11}
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
	</div>
</div>
