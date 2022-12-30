<script lang="ts">
	import { page } from '$app/stores';
	import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
	import ExportToFPuzzles from '$components/Modals/exportToFPuzzles.svelte';
	import WalkthroughEditorModal from '$components/Modals/WalkthroughEditorModal.svelte';
	import WalkthroughViewerModal from '$components/Modals/WalkthroughViewerModal.svelte';
	import CenterMarksIcon from '$icons/CenterMarks.svelte';
	import ColorPicker from '$icons/ColorPicker.svelte';
	import CornerMarksIcon from '$icons/CornerMarks.svelte';
	import NotesIcon from '$icons/Notes.svelte';
	import NumbersIcon from '$icons/Numbers.svelte';
	import ScannerIcon from '$icons/Scanner.svelte';
	import { openModal } from '$stores/modalStore';
	import { gameHistory, inputMode, highlights, editorHistory } from '$stores/sudokuStore';
	import { scanner } from '$stores/sudokuStore/scanner';
	import { walkthroughStore } from '$stores/walkthroughStore';
	import type { InputMode } from '$types';
	import SquareButton from '$ui/SquareButton.svelte';
	import { isCommandKey } from '$utils/isCommandKey';
	import classNames from 'classnames';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
	import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
	import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
	import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
	import PersonSimpleWalk from 'phosphor-svelte/lib/PersonSimpleWalk/PersonSimpleWalk.svelte';
	import Question from 'phosphor-svelte/lib/Question/Question.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import CenterMarks from './components/CenterMarks.svelte';
	import CornerMarks from './components/CornerMarks.svelte';
	import GameColors from './components/GameColors.svelte';
	import Notes from './components/Notes.svelte';
	import Numbers from './components/Numbers.svelte';
	import Scanner from './components/Scanner.svelte';

	const { selectedCells, highlightedCells } = highlights;

	const controls: Record<
		string,
		{ icon: typeof NumbersIcon; controller: typeof Numbers; label: string }
	> = {
		values: { icon: NumbersIcon, controller: Numbers, label: 'Numbers' },
		cornermarks: { icon: CornerMarksIcon, controller: CornerMarks, label: 'Corner marks' },
		centermarks: { icon: CenterMarksIcon, controller: CenterMarks, label: 'Center marks' },
		colors: { icon: ColorPicker, controller: GameColors, label: 'Colors' },
		notes: { icon: NotesIcon, controller: Notes, label: 'Notes' },
		scanner: { icon: ScannerIcon, controller: Scanner, label: 'Scanner' }
	};

	$: controller = $inputMode && controls[$inputMode] ? controls[$inputMode]?.controller : Numbers;
	$: openControl = $inputMode && controls[$inputMode] ? controls[$inputMode]?.label : 'Numbers';

	function setInputMode(newInputMode: string): void {
		$inputMode = newInputMode as InputMode;
	}

	onMount(() => {
		$inputMode = 'values';
	});

	let gameInputModePreShortcut = get(inputMode);

	function handleKeyboardShortcuts(k: KeyboardEvent): void {
		// Check whether any targets have explicitly stated that shortcuts should be ignored
		if (
			(k.target as HTMLElement)?.dataset?.ignoreshortcuts != null ||
			(k.target as HTMLElement).parentElement?.dataset.ignoreshortcuts != null
		)
			return;
		// In notes mode, you should use command keys
		if ($inputMode === 'notes' && !isCommandKey(k)) return;
		switch (k.key) {
			case 'z':
				k.preventDefault();
				$inputMode = 'values';
				gameInputModePreShortcut = $inputMode;
				break;
			case 'x':
				k.preventDefault();
				$inputMode = 'cornermarks';
				gameInputModePreShortcut = $inputMode;
				break;
			case 'c':
				k.preventDefault();
				$inputMode = 'centermarks';
				gameInputModePreShortcut = $inputMode;
				break;
			case 'v':
				k.preventDefault();
				$inputMode = 'colors';
				gameInputModePreShortcut = $inputMode;
				break;
			case 'b':
				k.preventDefault();
				$inputMode = 'notes';
				gameInputModePreShortcut = $inputMode;
				break;
			case 'Shift':
				k.preventDefault();
				$inputMode = 'cornermarks';
				break;
			case 'Control':
				k.preventDefault();
				$inputMode = 'centermarks';
				break;
			case 's':
				k.preventDefault();
				if (!scanner.isScanning()) {
					scanner.startScan();
				} else {
					scanner.stopScan();
				}
				break;
			case 'a':
				k.preventDefault();
				if (scanner.isScanning()) {
					scanner.stopScan();
				}
				scanner.step();
				break;
			case 'h': {
				k.preventDefault();
				scanner.toggleSeen();

				highlightedCells.set(scanner.getHighlightedCells(get(selectedCells)));
				break;
			}
			case 't': {
				k.preventDefault();
				scanner.toggleTuples();

				highlightedCells.set(scanner.getHighlightedCells(get(selectedCells)));
				break;
			}
		}
	}

	function handleKeyUp(k: KeyboardEvent): void {
		if (isCommandKey(k)) {
			switch (k.key) {
				case 'Shift':
				case 'Control':
					k.preventDefault();
					$inputMode = gameInputModePreShortcut;
					break;
			}
		}
	}

	function showHelp(): void {
		openModal(ControllerHelpModal, { mode: 'game' });
	}

	function showExportToFPuzzlesModal(): void {
		openModal(ExportToFPuzzles);
	}

	function showWalkthroughEditorModal(): void {
		if ($page.url.pathname.includes('/sudoku/editor')) {
			openModal(WalkthroughEditorModal, {
				clues: get(editorHistory.subscribeToClues())
			});
		} else {
			openModal(WalkthroughViewerModal, {
				clues: get(editorHistory.subscribeToClues()),
				walkthrough: $walkthroughStore
			});
		}
	}
</script>

<svelte:window on:keydown={handleKeyboardShortcuts} on:keyup={handleKeyUp} />

<div
	class="grid grid-rows-7 sm:grid-rows-6 grid-cols-4 sm:grid-cols-5 gap-2 max-w-96 sm:w-120 h-160 sm:h-140 relative"
>
	<!-- Main control container -->
	<div class="row-span-4 col-span-5 sm:col-span-4 bg-gray-100 rounded-md shadow">
		<svelte:component this={controller} />
	</div>

	<!-- Rightmost controls -->
	<div
		class="row-span-1 col-span-4 sm:row-span-5 sm:col-span-1 bg-gray-100 rounded-md shadow flex flex-row sm:flex-col items-center gap-2 px-2 sm:py-2 overflow-x-scroll sm:overflow-y-scroll"
	>
		{#each Object.entries(controls) as [im, info]}
			<SquareButton
				text={info.label}
				class={classNames({ 'ring-2 border-white ring-blue-500': info.label === openControl })}
				on:click={() => {
					setInputMode(im);
				}}
			>
				<svelte:component this={info.icon} />
			</SquareButton>
		{/each}
	</div>

	<!-- Bottom Controls -->
	<div
		class="row-span-1 col-span-5 sm:col-span-4 bg-gray-100 rounded-md shadow flex justify-evenly items-center"
	>
		<SquareButton
			text="Undo"
			disabled={!gameHistory.canUndo}
			on:click={() => {
				gameHistory.undo();
			}}
		>
			<ArrowUUpLeft size={32} />
		</SquareButton>
		<SquareButton
			text="Redo"
			disabled={!gameHistory.canRedo}
			on:click={() => {
				gameHistory.redo();
			}}
		>
			<ArrowUUpRight size={32} />
		</SquareButton>
		<SquareButton
			text="Restart"
			on:click={() => {
				gameHistory.reset();
			}}
		>
			<ArrowCounterClockwise size={32} />
		</SquareButton>
	</div>

	<!-- Aux Controls -->
	<div class="row-span-1 col-span-6 sm:col-span-5 flex justify-evenly items-center">
		<button
			on:click={showHelp}
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
			title="help"
		>
			<Question size={32} />
		</button>

		{#if $page.url.pathname.includes('/sudoku/editor') || $walkthroughStore.length > 0}
			<button
				title="Walkthrough"
				class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
				on:click={showWalkthroughEditorModal}
			>
				<PersonSimpleWalk size={32} />
			</button>
		{/if}

		<button
			on:click={showExportToFPuzzlesModal}
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded"
			title="Export"
		>
			<FileArrowUp size={32} />
		</button>
	</div>
</div>
