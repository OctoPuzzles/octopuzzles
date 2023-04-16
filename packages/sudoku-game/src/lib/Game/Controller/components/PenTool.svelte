<script lang="ts">
  import {
    gameHistory,
    handleMouseDownHitbox,
    handleMouseEnterHitbox,
    highlightedCells,
    selectedCells
  } from '$lib/sudokuStore';
  import type { Color, PenTool } from '@octopuzzles/models';
  import { Colors } from '@octopuzzles/models';
  import { SquareButton } from '@octopuzzles/ui';
  import { gameAction } from '$lib/gameAction';
  import { onDestroy, onMount } from 'svelte';
  import type {
    HitboxType,
    OnMouseDownHitboxHandler,
    OnMouseEnterHitboxHandler
  } from '@octopuzzles/sudoku-display';
  import { deepCopy } from '@octopuzzles/utils';
  import { splitLineOnOverlap, startsInsideOtherLine } from '$lib/utils';

  const userInputs = gameHistory.subscribeToInputs();

  let penColor: Color = 'Black';

  onMount(() => {
    $selectedCells = [];
    $highlightedCells = [];
    const penTools = $userInputs.pentool;
    if (penTools && penTools[penTools.length - 1]) {
      const lastPenTool = penTools[penTools.length - 1];
      if (lastPenTool.color) {
        penColor = lastPenTool.color;
      }
    }
  });

  const onMouseUp = () => {
    const currentPenTools = deepCopy($userInputs.pentool) ?? [];
    const lastPenTool = currentPenTools[currentPenTools.length - 1];
    if (lastPenTool == null) return;
    if (lastPenTool.positions.length === 1) {
      // We are in the middle of toggling the last pen tool
      currentPenTools.pop();
      // First, check if a previous pen tool lies exactly on top. Then toggle that instead and remove this
      const otherPenToolIndex = currentPenTools.findIndex(
        (pt) =>
          pt.positions.length === 1 &&
          pt.positions[0].row === lastPenTool.positions[0].row &&
          pt.positions[0].column === lastPenTool.positions[0].column
      );
      if (otherPenToolIndex > -1) {
        // Another pen tool lies exactly the same place, toggle that
        const newPenTools: PenTool[] = [];
        currentPenTools.forEach((pt, i) => {
          if (i === otherPenToolIndex) {
            if (pt.type === 'circle') {
              newPenTools.push({ ...pt, type: 'cross' });
              return;
            }
          } else {
            newPenTools.push(pt);
          }
        });
        gameHistory.replaceCurrentStep({ pentool: newPenTools });
      } else {
        // No other pen tool lied there, so just toggle this one
        if (lastPenTool.type === 'line') {
          currentPenTools.push({ ...lastPenTool, type: 'circle' });
        } else if (lastPenTool.type === 'circle') {
          currentPenTools.push({ ...lastPenTool, type: 'cross' });
        } else {
          // The pen tool will be removed
        }
        gameHistory.replaceCurrentStep({ pentool: currentPenTools });
      }
    } else {
      currentPenTools.pop();
      if (currentPenTools.some((p) => startsInsideOtherLine(lastPenTool.positions, p.positions))) {
        // This new line is meant for deletion.
        const newPenTools: PenTool[] = [];
        currentPenTools.forEach((p) => {
          const newLines = splitLineOnOverlap(lastPenTool.positions, p.positions);
          if (newLines.length > 0) {
            newPenTools.push(...newLines.map((l) => ({ ...p, positions: l })));
          }
        });
        gameHistory.replaceCurrentStep({ pentool: newPenTools });
      } else {
        gameHistory.replaceCurrentStep({ pentool: [...currentPenTools, lastPenTool] });
      }
    }
  };

  const onMouseDownHitbox: OnMouseDownHitboxHandler = (type, position) => {
    const currentPenTools = deepCopy($userInputs.pentool) ?? [];
    if (type === 'border') {
      gameHistory.set({
        pentool: [...currentPenTools, { positions: [position], type: 'circle', color: penColor }]
      });
    } else {
      gameHistory.set({
        pentool: [...currentPenTools, { positions: [position], type: 'line', color: penColor }]
      });
    }
  };
  const onMouseEnterHitbox: OnMouseEnterHitboxHandler = (type, position) => {
    const currentPenTools = deepCopy($userInputs.pentool) ?? [];
    const lastPenTool = currentPenTools[currentPenTools.length - 1];
    if (lastPenTool == null || lastPenTool.positions.length === 0) return;
    // TODO: If the user drags the mouse in from outside

    const previousPenPosition = lastPenTool.positions[lastPenTool.positions.length - 1];
    let previousPenPositionType: HitboxType = 'center';
    if (Math.round(previousPenPosition.row) === previousPenPosition.row) {
      if (Math.round(previousPenPosition.column) === previousPenPosition.column) {
        previousPenPositionType = 'corner';
      } else {
        previousPenPositionType = 'border';
      }
    } else if (Math.round(previousPenPosition.column) === previousPenPosition.column) {
      previousPenPositionType = 'border';
    }

    if (previousPenPositionType === 'border') {
      // Start a new line with the new type
      gameHistory.replaceCurrentStep({
        pentool: [...currentPenTools, { positions: [position], type: 'line', color: penColor }]
      });
      return;
    }

    if (previousPenPositionType === type) {
      currentPenTools.pop();
      currentPenTools.push({ ...lastPenTool, positions: [...lastPenTool.positions, position] });
      gameHistory.replaceCurrentStep({ pentool: currentPenTools });
    }
  };

  onMount(() => {
    $handleMouseDownHitbox = onMouseDownHitbox;
    $handleMouseEnterHitbox = onMouseEnterHitbox;
  });

  onDestroy(() => {
    $handleMouseDownHitbox = undefined;
    $handleMouseEnterHitbox = undefined;
  });

  function handleKeyDown(k: KeyboardEvent): void {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(k.key)) {
      penColor = Colors[Number(k.key)];
    }
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyDown }} on:mouseup={onMouseUp} />

<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as number}
      {@const color = Colors[number]}
      <div>
        <SquareButton
          variant="customColor"
          class="text-{color.toLowerCase()}-500 bg-{color.toLowerCase()}-500"
          on:click={() => (penColor = color)}
          title={number}
        />
      </div>
    {/each}
  </div>
</div>
