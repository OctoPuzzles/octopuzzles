<script lang="ts">
	import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
	import ImportFromFPuzzles from '$components/Modals/ImportFromFPuzzles.svelte';
	import ControllerSkeleton from '$components/Sudoku/ControllerSkeleton.svelte';
	import BorderCluesIcon from '$icons/BorderClues.svelte';
	import CellCluesIcon from '$icons/CellClues.svelte';
	import CellsIcon from '$icons/Cells.svelte';
	import ColorPicker from '$icons/ColorPicker.svelte';
	import DimensionsIcon from '$icons/Dimensions.svelte';
	import GivensIcon from '$icons/Givens.svelte';
	import KillerCagesIcon from '$icons/KillerCages.svelte';
	import LogicIcon from '$icons/Logic.svelte';
	import PathsIcon from '$icons/Paths.svelte';
	import RegionsIcon from '$icons/Regions.svelte';
	import { openModal } from '$stores/modalStore';
	import { editorHistory, inputMode } from '$stores/sudokuStore';
	import type { InputMode } from '$types';
	import SquareButton from '$ui/SquareButton.svelte';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
	import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
	import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
	import FileArrowDown from 'phosphor-svelte/lib/FileArrowDown/FileArrowDown.svelte';
	import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
	import Gear from 'phosphor-svelte/lib/Gear/Gear.svelte';
	import Question from 'phosphor-svelte/lib/Question/Question.svelte';
	import { onMount } from 'svelte';
	import BorderClues from './components/BorderClues.svelte';
	import CellClues from './components/CellClues.svelte';
	import Cells from './components/Cells.svelte';
	import Dimensions from './components/Dimensions.svelte';
	import EditorColors from './components/EditorColors.svelte';
	import Givens from './components/Givens.svelte';
	import KillerCages from './components/KillerCages.svelte';
	import Logic from './components/Logic.svelte';
	import Paths from './components/Paths.svelte';
	import Regions from './components/Regions.svelte';
	import UserSettingsModal from '$components/Modals/UserSettingsModal.svelte';
	import { navigating } from '$app/stores';
	import { exportPuzzle } from '$features/fpuzzles/exportAsFPuzzlesJson';
	import FPuzzles from '$icons/FPuzzles.svelte';
	import CtC from '$icons/CtC.svelte';

	const controls: Record<
		string,
		{ icon: typeof GivensIcon; controller: typeof Givens; label: string }
	> = {
		givens: { icon: GivensIcon, controller: Givens, label: 'Givens' },
		cellclues: { icon: CellCluesIcon, controller: CellClues, label: 'Cell clues' },
		borderclues: { icon: BorderCluesIcon, controller: BorderClues, label: 'Border clues' },
		paths: { icon: PathsIcon, controller: Paths, label: 'Paths' },
		extendedcages: { icon: KillerCagesIcon, controller: KillerCages, label: 'Cages' },
		regions: { icon: RegionsIcon, controller: Regions, label: 'Regions' },
		logic: { icon: LogicIcon, controller: Logic, label: 'Logic' },
		dimensions: { icon: DimensionsIcon, controller: Dimensions, label: 'Dimensions' },
		cells: { icon: CellsIcon, controller: Cells, label: 'Cells' },
		colors: { icon: ColorPicker, controller: EditorColors, label: 'Colors' }
	};

	$: controller = $inputMode && controls[$inputMode] ? controls[$inputMode]?.controller : Givens;
	$: openControl = $inputMode && controls[$inputMode] ? controls[$inputMode]?.label : 'Givens';

	function setInputMode(newInputMode: string): void {
		$inputMode = newInputMode as InputMode;
	}

	onMount(() => {
		$inputMode = 'givens';
	});

	function showHelp(): void {
		openModal(ControllerHelpModal, { mode: 'editor' });
	}

	function showImportFromFPuzzlesModal(): void {
		openModal(ImportFromFPuzzles);
	}

	function showSettingsModal(): void {
		openModal(UserSettingsModal);
	}

	let exportDetails: HTMLDetailsElement;

	$: if ($navigating && exportDetails) exportDetails.open = false;
</script>

<ControllerSkeleton
	menuItems={Object.entries(controls).map(([im, info]) => ({
		icon: info.icon,
		isSelected: info.label === openControl,
		onClick: () => setInputMode(im),
		title: info.label
	}))}
>
	<svelte:component this={controller} slot="main" />
	<svelte:fragment slot="bottom">
		<SquareButton
			text="Undo"
			disabled={!editorHistory.canUndo}
			on:click={() => {
				editorHistory.undo();
			}}
		>
			<ArrowUUpLeft size={32} />
		</SquareButton>
		<SquareButton
			text="Redo"
			disabled={!editorHistory.canRedo}
			on:click={() => {
				editorHistory.redo();
			}}
		>
			<ArrowUUpRight size={32} />
		</SquareButton>
		<SquareButton
			text="Restart"
			on:click={() => {
				editorHistory.reset();
			}}
		>
			<ArrowCounterClockwise size={32} />
		</SquareButton>
	</svelte:fragment>
	<svelte:fragment slot="aux">
		<button
			on:click={showHelp}
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
			title="help"
		>
			<Question size={32} />
		</button>
		<button
			on:click={showImportFromFPuzzlesModal}
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
			title="Import from f-puzzles"
		>
			<FileArrowDown size={32} />
		</button>

		<details bind:this={exportDetails}>
			<summary
				class="cursor-pointer flex justify-center items-center mr-2 w-8 h-8 hover:ring hover:ring-orange-500 rounded"
				aria-label="Export to f-puzzles/CtC"
				aria-haspopup="menu"
				title="Export to f-puzzles/CtC"
			>
				<FileArrowUp size={32} />
			</summary>
			<div
				class="absolute list-none shadow-lg bg-white ring-1 ring-black ring-opacity-10 focus:outline-none rounded-md mt-0.5 overflow-hidden z-50"
				role="menu"
			>
				<button
					on:click={() => exportPuzzle('FPuzzles')}
					class="w-8 h-8"
					title="Export to f-puzzles"
				>
					<FPuzzles />
				</button>
				<button on:click={() => exportPuzzle('CTC')} class="w-8 h-8" title="Export to CtC">
					<CtC />
				</button>
			</div>
		</details>

		<button
			on:click={showSettingsModal}
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
			title="Settings"
		>
			<Gear size={32} />
		</button>
	</svelte:fragment>
</ControllerSkeleton>

<style>
	/* Allow the export dropdown to close when pressing outside the dropdown */
	details[open] > summary::before {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 40;
		display: block;
		cursor: default;
		content: ' ';
		background: transparent;
	}
</style>
