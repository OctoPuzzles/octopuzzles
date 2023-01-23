<script lang="ts">
	import { page } from '$app/stores';
	import ControllerHelpModal from '$components/Modals/ControllerHelpModal.svelte';
	import WalkthroughEditorModal from '$components/Modals/WalkthroughEditorModal.svelte';
	import WalkthroughViewerModal from '$components/Modals/WalkthroughViewerModal.svelte';
	import ControllerSkeleton from '$components/Sudoku/ControllerSkeleton.svelte';
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
	import { isCommandKey } from '$utils/keyboard/isCommandKey';
	import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
	import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
	import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
	import FileArrowUp from 'phosphor-svelte/lib/FileArrowUp/FileArrowUp.svelte';
	import Gear from 'phosphor-svelte/lib/Gear/Gear.svelte';
	import Check from 'phosphor-svelte/lib/Check/Check.svelte';
	import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk/FloppyDisk.svelte';
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
	import trpc from '$lib/client/trpc';
	import UserSettingsModal from '$components/Modals/UserSettingsModal.svelte';
	import { navigating } from '$app/stores';
	import { compressToBase64 } from '$features/compressor';
	import { exportAsFPuzzlesJson } from '$features/fpuzzles/exportAsFPuzzlesJson';
	import FPuzzles from '$icons/FPuzzles.svelte';
	import CtC from '$icons/CtC.svelte';

	const { selectedCells, highlightedCells, wrongCells } = highlights;
	const { solution } = editorHistory;

	const controls: Record<
		string,
		{ icon: typeof NumbersIcon; controller: typeof Numbers; label: string; shortcut?: string }
	> = {
		digits: { icon: NumbersIcon, controller: Numbers, label: 'Digits', shortcut: 'Z' },
		cornermarks: {
			icon: CornerMarksIcon,
			controller: CornerMarks,
			label: 'Corner marks',
			shortcut: 'X'
		},
		centermarks: {
			icon: CenterMarksIcon,
			controller: CenterMarks,
			label: 'Center marks',
			shortcut: 'C'
		},
		colors: { icon: ColorPicker, controller: GameColors, label: 'Colors', shortcut: 'V' },
		notes: { icon: NotesIcon, controller: Notes, label: 'Notes' },
		scanner: { icon: ScannerIcon, controller: Scanner, label: 'Scanner', shortcut: 'B' }
	};

	$: controller = $inputMode && controls[$inputMode] ? controls[$inputMode]?.controller : Numbers;
	$: openControl = $inputMode && controls[$inputMode] ? controls[$inputMode]?.label : 'Numbers';

	function setInputMode(newInputMode: string): void {
		$inputMode = newInputMode as InputMode;
	}

	onMount(() => {
		$inputMode = 'digits';
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
				$inputMode = 'digits';
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
			case 'w': {
				k.preventDefault();
				walkthroughStore.addStep();
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

	function showSettingsModal(): void {
		openModal(UserSettingsModal);
	}

	function checkSolution(): void {
		$wrongCells = scanner.getErrorCells($solution);
	}

	async function saveProgress(): Promise<void> {
		const gameData = get(gameHistory.subscribeToInputs());

		await trpc().mutation('savedGames:createOrUpdate', {
			sudokuId: parseInt($page.params.id),
			gameData
		});
	}

	let exportDetails: HTMLDetailsElement;

	$: if ($navigating && exportDetails) exportDetails.open = false;

	function exportPuzzle(to: 'FPuzzles' | 'CTC') {
		let href: string;
		switch (to) {
			case 'FPuzzles':
				href = 'https://www.f-puzzles.com/?load=';
				break;
			case 'CTC':
				href = 'https://app.crackingthecryptic.com/sudoku/?puzzleid=fpuzzles';
				break;
			default:
				return;
		}

		href += compressToBase64(exportAsFPuzzlesJson());

		window.open(href, '_blank', 'noreferrer');
	}
</script>

<svelte:window on:keydown={handleKeyboardShortcuts} on:keyup={handleKeyUp} />

<ControllerSkeleton
	menuItems={Object.entries(controls).map(([im, info]) => ({
		icon: info.icon,
		isSelected: info.label === openControl,
		onClick: () => setInputMode(im),
		title: info.label,
		shortcut: info.shortcut
	}))}
>
	<svelte:component this={controller} slot="main" />

	<svelte:fragment slot="bottom">
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
			title="Check digits"
			class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
			on:click={checkSolution}
		>
			<Check size={32} />
		</button>
		{#if !$page.url.pathname.includes('/sudoku/editor')}
			<button
				title="Save for later"
				class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
				on:click={saveProgress}
			>
				<FloppyDisk size={32} />
			</button>
		{/if}

		{#if $page.url.pathname.includes('/sudoku/editor') || $walkthroughStore.length > 0}
			<button
				title="Walkthrough"
				class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
				on:click={showWalkthroughEditorModal}
			>
				<PersonSimpleWalk size={32} />
			</button>
		{/if}

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
