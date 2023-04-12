<script lang="ts">
  import { gameHistory, handleMouseDownHitbox, handleMouseEnterHitbox } from '$lib/sudokuStore';
  import type { PenTool, PenToolType } from '@octopuzzles/models';
  import { Colors } from '@octopuzzles/models';
  import { SquareButton } from '@octopuzzles/ui';
  import { gameAction } from '$lib/gameAction';
  import { onDestroy, onMount } from 'svelte';
  import type {
    OnMouseDownHitboxHandler,
    OnMouseEnterHitboxHandler
  } from '@octopuzzles/sudoku-display';
  import { deepCopy } from '@octopuzzles/utils';

  const userInputs = gameHistory.subscribeToInputs();

  let currentPenTool: PenTool = {
    color: 'Black',
    type: 'line',
    positions: []
  };

  onMount(() => {
    const penTools = $userInputs.pentool;
    if (penTools && penTools[penTools.length - 1]) {
      const lastPenTool = penTools[penTools.length - 1];
      if (lastPenTool.color) {
        currentPenTool.color = lastPenTool.color;
      }
    }
  });

  const onMouseUp = () => {
    const currentPenTools = deepCopy($userInputs.pentool) ?? [];
    if (currentPenTool.positions.length === 0) return;
    if (currentPenTool.positions.length === 1) {
      const currentPenToolPosition = currentPenTool.positions[0];
      // Check if there are any previous pen tools that are just in that cell. If so, toggle it around.
      const otherPenToolIndex = currentPenTools.findIndex(
        (pt) =>
          pt.positions.length === 1 &&
          pt.positions[0].row === currentPenToolPosition.row &&
          pt.positions[0].column === currentPenToolPosition.column
      );
      if (otherPenToolIndex < 0) {
        // No other pen tool was just that cell. So just as the new pen tool
        gameHistory.set({ pentool: [...currentPenTools, { ...currentPenTool, type: 'circle' }] });
      } else {
        const newPenTools: PenTool[] = [];
        currentPenTools.forEach((pt, i) => {
          if (i === otherPenToolIndex) {
            if (pt.type === 'circle') {
              newPenTools.push({ ...pt, type: 'cross' as PenToolType });
              return;
            } else {
              return;
            }
          }
          newPenTools.push(pt);
        });
        gameHistory.set({ pentool: newPenTools });
      }
    } else {
      const newPenTools = [...currentPenTools, currentPenTool];
      gameHistory.set({ pentool: newPenTools });
    }

    currentPenTool = {
      positions: [],
      type: 'line',
      color: 'Black'
    };
  };
  const onMouseDownHitbox: OnMouseDownHitboxHandler = (type, position) => {
    currentPenTool.positions = [position];
  };
  const onMouseEnterHitbox: OnMouseEnterHitboxHandler = (type, position) => {
    currentPenTool.positions.push(position);
  };

  $: console.log({ pentool: $userInputs.pentool });

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
      currentPenTool.color = Colors[Number(k.key)];
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
          on:click={() => (currentPenTool.color = color)}
          title={number}
        />
      </div>
    {/each}
  </div>
</div>
