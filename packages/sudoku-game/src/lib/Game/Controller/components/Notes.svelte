<script lang="ts">
  import type { Annotation, Annotations, Color, Position } from '@octopuzzles/models';
  import {
    gameHistory,
    highlightedCells,
    highlightedItemIndex,
    selectedCells,
    selectedItemIndex,
    handleArrows,
    handleClickCell,
    handleEnterCell
  } from '$lib/sudokuStore';
  import { Button, ColorSelect, ControllerButton, Input } from '@octopuzzles/ui';
  import {
    deepCopy,
    isCommandKey,
    moveArrayElement,
    type ArrowDirection
  } from '@octopuzzles/utils';
  import { onMount } from 'svelte';
  import { defaultHandleArrows } from '$lib/sudokuStore/interactionHandlers';
  import type { OnClickCellHandler, OnEnterCellHandler } from '@octopuzzles/sudoku-display';
  import { get } from 'svelte/store';
  import classNames from 'classnames';

  const notes = gameHistory.getValue('notes');
  let input: Input;

  $: firstSelectedCell = $selectedCells.length === 1 ? $selectedCells[0] : undefined;

  $: if ($selectedItemIndex === -1 && firstSelectedCell != null) {
    populateFromSelectedCell(firstSelectedCell);
  }

  $: $selectedCells, input != null && setTimeout(() => input != null && input.focus(), 100);

  $: color, updateSelectedNote();

  function populateFromSelectedCell(selectedCell: Position): void {
    $selectedItemIndex = $notes.findIndex((n) =>
      n.positions.some((p) => p.row === selectedCell.row && p.column === selectedCell.column)
    );
  }

  let details = '';
  let color: Color | 'NONE' = 'NONE';

  $: noteSelected($selectedItemIndex);

  function noteSelected(selectedItemIndex: number): void {
    const note = $notes[selectedItemIndex];

    updateSettings(note);
  }

  function updateSettings(note?: Partial<Annotation>): void {
    details = note?.details ?? '';
    color = note?.color ?? 'NONE';
  }

  $: details, handleInput();

  function handleInput(): void {
    updateSelectedNote();
  }

  function updateSelectedNote(): void {
    if ($selectedItemIndex === -1) return;

    let newNotes: Annotations = [];
    $notes.forEach((note, i) => {
      if (i !== $selectedItemIndex) {
        newNotes = [...newNotes, note];
      } else {
        newNotes = [...newNotes, newNote(note.positions)];
      }
    });

    gameHistory.set({ notes: newNotes });
  }

  function deleteNoteAtIndex(index: number): void {
    const newNotes = $notes.filter((_, i) => index !== i);
    $selectedCells = [];
    $highlightedCells = [];
    $selectedItemIndex = -1;
    gameHistory.set({ notes: newNotes });
  }

  function reorderNote(index: number, way: 'up' | 'down'): void {
    let newNotes: Annotations = [];
    if (way === 'up') {
      if (index === 0) return;
      newNotes = moveArrayElement($notes, index, index - 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex--;
      } else if (index - 1 === $selectedItemIndex) {
        $selectedItemIndex++;
      }
    } else if (way === 'down') {
      if (index === $notes.length - 1) return;
      newNotes = moveArrayElement($notes, index, index + 1);
      if (index === $selectedItemIndex) {
        $selectedItemIndex++;
      } else if (index + 1 === $selectedItemIndex) {
        $selectedItemIndex--;
      }
    }
    gameHistory.set({ notes: newNotes });
  }

  function newNote(positions: Position[]): Annotation {
    return {
      positions,
      type: 'Note',
      color: color !== 'NONE' ? color : undefined,
      details: details !== '' ? details : undefined
    };
  }

  function newNoteFromSelection(): void {
    if ($selectedCells.length > 0) {
      if ($selectedItemIndex !== -1) {
        details = '';
        color = 'NONE';
      }
      gameHistory.set({
        notes: [...deepCopy($notes), newNote(deepCopy($selectedCells))]
      });
      $selectedItemIndex = $notes.length - 1;
    }
  }

  function addCellToSelectedNote(cell: Position, keep = true): void {
    const newNotes: Annotations = [];
    const selectedPathIndex = $selectedItemIndex;
    let removed = false;

    $notes.map((note, i) => {
      if (i === selectedPathIndex) {
        let found = false;
        let newPositions = note.positions.filter((c) => {
          if (c.row === cell.row && c.column === cell.column) {
            found = true;
            return keep;
          }
          return true;
        });
        if (!found) {
          newPositions = [...newPositions, cell];
        }
        if (newPositions.length > 0) {
          newNotes.push({ ...note, positions: newPositions });
        } else {
          removed = true;
        }
      } else {
        newNotes.push(note);
      }
    });
    gameHistory.set({ notes: newNotes });
    if (!removed) {
      $selectedCells = newNotes[selectedPathIndex]?.positions ?? [];
      $selectedItemIndex = selectedPathIndex;
    } else {
      $selectedCells = [];
    }
  }

  const customHandleClickCell: OnClickCellHandler = (cell, metaButtonClicked) => {
    if (!metaButtonClicked) {
      selectedCells.set([cell]);
    } else {
      if ($selectedItemIndex > -1) {
        addCellToSelectedNote(cell, false);
      } else {
        selectedCells.add(cell);
      }
    }
  };

  const customHandleEnterCell: OnEnterCellHandler = (cell) => {
    if ($selectedItemIndex === -1) {
      selectedCells.add(cell);
    } else {
      if ($selectedCells.length > 0) {
        addCellToSelectedNote(cell);
      }
    }
  };

  const customHandleArrows = (direction: ArrowDirection, k: KeyboardEvent): void => {
    if (!isCommandKey(k)) {
      defaultHandleArrows(direction, k);
      return;
    }
    const lastSelectedCell = $selectedCells[$selectedCells.length - 1];
    if (lastSelectedCell != null) {
      const { row, column } = lastSelectedCell;
      const dim = get(gameHistory.clues).dimensions;
      let newCell: Position | undefined = undefined;
      switch (direction) {
        case 'up':
          if (row !== 0) {
            newCell = { row: row - 1, column };
          } else {
            newCell = { row: 8, column };
          }
          break;
        case 'right':
          if (column !== dim.columns - 1) {
            newCell = { row, column: column + 1 };
          } else {
            newCell = { row, column: 0 };
          }
          break;
        case 'down':
          if (row !== dim.rows - 1) {
            newCell = { row: row + 1, column };
          } else {
            newCell = { row: 0, column };
          }
          break;
        case 'left':
          if (column !== 0) {
            newCell = { row, column: column - 1 };
          } else {
            newCell = { row, column: 8 };
          }
          break;
        default:
          break;
      }
      if (newCell) {
        k.preventDefault();
        if (isCommandKey(k)) {
          if ($selectedItemIndex > -1) {
            addCellToSelectedNote(newCell);
          } else {
            selectedCells.add(newCell);
          }
        } else {
          $selectedCells = [newCell];
          $selectedItemIndex = -1;
        }
      }
    }
  };

  onMount(() => {
    $handleClickCell = customHandleClickCell;

    $handleEnterCell = customHandleEnterCell;

    $handleArrows = customHandleArrows;
  });
</script>

<div class="grid grid-cols-2 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        {#each $notes as note, index (index)}
          <ControllerButton
            isHighlighted={index === $selectedItemIndex}
            onClick={() => {
              selectedCells.set(note.positions);
              $selectedItemIndex = index;
            }}
            onDelete={() => deleteNoteAtIndex(index)}
            onHover={() => {
              $highlightedCells = note.positions;
              $highlightedItemIndex = index;
            }}
            onHoverOut={() => {
              $highlightedCells = [];
              $highlightedItemIndex = -1;
            }}
            onMoveUp={() => reorderNote(index, 'up')}
            onMoveDown={() => reorderNote(index, 'down')}
          >
            <p class={classNames(`text-${color !== 'NONE' ? color.toLowerCase() : 'black'}`)}>
              Note {index + 1}
            </p>
            <!-- TODO: find some way to display the note or a snippet of it in the button
              <p
                class={classNames(
                  'overflow-hidden',
                  'text-overflow-ellipsis',
                  'white-space-nowrap',
                  `text-${color !== 'NONE' ? color.toLowerCase() : 'black'}`
                )}
              >
                {details}
              </p>-->
          </ControllerButton>
        {/each}
      </div>
    </div>

    <Button
      variant="secondary"
      class="w-full"
      disabled={$selectedCells.length === 0}
      on:click={newNoteFromSelection}
    >
      New note from selection
    </Button>
  </div>
  <div class="px-2 flex flex-col">
    <div>
      <Input
        bind:this={input}
        asTextarea
        bind:value={details}
        placeholder="note"
        title="Write a note"
      />
    </div>
    <div><ColorSelect bind:color allowNone={true} class="w-full" /></div>
  </div>
</div>
