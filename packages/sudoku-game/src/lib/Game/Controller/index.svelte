<script lang="ts">
  import { page } from '$app/stores';
  import { WalkthroughEditorModal, WalkthroughViewerModal } from '@octopuzzles/walkthroughs';
  import {
    CenterMarks as CenterMarksIcon,
    ColorPicker,
    CornerMarks as CornerMarksIcon,
    Notes as NotesIcon,
    Numbers as NumbersIcon,
    Scanner as ScannerIcon,
    PenTool as PenToolIcon
  } from '@octopuzzles/icons';
  import { gameHistory, inputMode, selectedCells, highlightedCells } from '$lib/sudokuStore';
  import { scanner } from '$lib/sudokuStore/scanner';
  import type { InputMode, WalkthroughStep } from '@octopuzzles/models';
  import { SquareButton, ControllerSkeleton } from '@octopuzzles/ui';
  import { deepCopy, isCommandKey } from '@octopuzzles/utils';
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise/ArrowCounterClockwise.svelte';
  import ArrowUUpLeft from 'phosphor-svelte/lib/ArrowUUpLeft/ArrowUUpLeft.svelte';
  import ArrowUUpRight from 'phosphor-svelte/lib/ArrowUUpRight/ArrowUUpRight.svelte';
  import PersonSimpleWalk from 'phosphor-svelte/lib/PersonSimpleWalk/PersonSimpleWalk.svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import CenterMarks from './components/CenterMarks.svelte';
  import CornerMarks from './components/CornerMarks.svelte';
  import GameColors from './components/GameColors.svelte';
  import Notes from './components/Notes.svelte';
  import Numbers from './components/Numbers.svelte';
  import Scanner from './components/Scanner.svelte';
  import Help from '../Help.svelte';
  import { gameAction } from '$lib/gameAction';
  import PenTool from './components/PenTool.svelte';

  const gameData = gameHistory.subscribeToInputs();
  export let walkthrough: WalkthroughStep[];

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
    scanner: { icon: ScannerIcon, controller: Scanner, label: 'Scanner', shortcut: 'B' },
    pentool: { icon: PenToolIcon, controller: PenTool, label: 'Pen Tool', shortcut: 'N' }
  };

  $: controller =
    $inputMode && controls[$inputMode] != null ? controls[$inputMode]?.controller : Numbers;
  $: openControl =
    $inputMode && controls[$inputMode] != null ? controls[$inputMode]?.label : 'Numbers';

  function setInputMode(newInputMode: string): void {
    $inputMode = newInputMode as InputMode;
  }

  onMount(() => {
    $inputMode = 'digits';
  });

  let gameInputModePreShortcut = get(inputMode);

  function handleKeyboardShortcuts(k: KeyboardEvent): void {
    if (['textarea', 'input'].includes((k.target as Element).tagName.toLowerCase())) {
      // When inputs are focused, don't use shortcuts
      return;
    }

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
      case 'n':
        k.preventDefault();
        $inputMode = 'pentool';
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
        walkthrough = [...walkthrough, { description: '', gameData: deepCopy($gameData) }];
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

  let walkthroughEditorModalIsOpen = false;
  let walkthroughViewerModalIsOpen = false;

  const clues = gameHistory.clues;

  function showWalkthroughEditorModal(): void {
    if ($page.url.pathname.includes('/sudoku/editor')) {
      walkthroughEditorModalIsOpen = true;
    } else {
      walkthroughViewerModalIsOpen = true;
    }
  }

  const canUndo = gameHistory.canUndo;
  const canRedo = gameHistory.canRedo;
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyboardShortcuts, onKeyUp: handleKeyUp }} />

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
      disabled={!$canUndo}
      on:click={() => {
        gameHistory.undo();
      }}
    >
      <ArrowUUpLeft size={32} />
    </SquareButton>
    <SquareButton
      text="Redo"
      disabled={!$canRedo}
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
    {#if $page.url.pathname.includes('/sudoku/editor') || walkthrough.length > 0}
      <button
        title="Walkthrough"
        class="w-8 h-8 hover:ring hover:ring-orange-500 rounded-full"
        on:click={showWalkthroughEditorModal}
      >
        <PersonSimpleWalk size={32} />
      </button>
    {/if}

    <slot />
  </svelte:fragment>
  <Help slot="helpModalContent" />
</ControllerSkeleton>

<WalkthroughEditorModal
  bind:isOpen={walkthroughEditorModalIsOpen}
  clues={$clues}
  gameData={$gameData}
  onClickStep={(step) => gameHistory.set(step)}
  bind:walkthrough
/>
<WalkthroughViewerModal
  onClickStep={(step) => gameHistory.set(step)}
  bind:isOpen={walkthroughViewerModalIsOpen}
  clues={$clues}
  {walkthrough}
/>
