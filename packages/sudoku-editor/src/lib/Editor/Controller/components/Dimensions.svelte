<script lang="ts">
  import { editorHistory, setMargins } from '$lib/sudokuStore';
  import type { Dimensions } from '@octopuzzles/models';
  import {
    defaultBorderclues,
    defaultCages,
    defaultCellclues,
    defaultCells,
    defaultEditorColors,
    defaultGivens,
    defaultPaths,
    defaultRegions
  } from '@octopuzzles/sudoku-utils';
  import { Button, Input } from '@octopuzzles/ui';

  const sudokuClues = editorHistory.subscribeToClues();

  let marginLeft = String(
    $sudokuClues.dimensions.margins ? $sudokuClues.dimensions.margins.left : 0
  );
  let marginRight = String(
    $sudokuClues.dimensions.margins ? $sudokuClues.dimensions.margins.right : 0
  );
  let marginTop = String($sudokuClues.dimensions.margins ? $sudokuClues.dimensions.margins.top : 0);
  let marginBottom = String(
    $sudokuClues.dimensions.margins ? $sudokuClues.dimensions.margins.bottom : 0
  );
  let rows = String(
    $sudokuClues.dimensions.rows -
      ($sudokuClues.dimensions.margins
        ? $sudokuClues.dimensions.margins.top + $sudokuClues.dimensions.margins.bottom
        : 0)
  );
  let columns = String(
    $sudokuClues.dimensions.columns -
      ($sudokuClues.dimensions.margins
        ? $sudokuClues.dimensions.margins.left + $sudokuClues.dimensions.margins.right
        : 0)
  );

  function update(): void {
    const newDimensions: Dimensions = {
      rows: parseInt(rows) + parseInt(marginTop) + parseInt(marginBottom),
      columns: parseInt(columns) + parseInt(marginLeft) + parseInt(marginRight),
      margins:
        parseInt(marginLeft + marginRight + marginTop + marginBottom) > 0
          ? {
              left: parseInt(marginLeft),
              right: parseInt(marginRight),
              top: parseInt(marginTop),
              bottom: parseInt(marginBottom)
            }
          : undefined
    };

    if (
      rows !==
        String(
          $sudokuClues.dimensions.rows -
            ($sudokuClues.dimensions.margins
              ? $sudokuClues.dimensions.margins.top + $sudokuClues.dimensions.margins.bottom
              : 0)
        ) ||
      columns !==
        String(
          $sudokuClues.dimensions.columns -
            ($sudokuClues.dimensions.margins
              ? $sudokuClues.dimensions.margins.left + $sudokuClues.dimensions.margins.right
              : 0)
        )
    ) {
      editorHistory.set({
        dimensions: newDimensions,
        borderclues: defaultBorderclues(),
        cellclues: defaultCellclues(),
        colors: defaultEditorColors(newDimensions),
        extendedcages: defaultCages(),
        givens: defaultGivens(newDimensions),
        paths: defaultPaths(),
        cells: defaultCells(newDimensions),
        regions: defaultRegions(newDimensions)
      });
    } else {
      let frameChanged = false;
      if ($sudokuClues.dimensions.margins == null) {
        frameChanged = newDimensions.margins != null;
      } else if (newDimensions.margins != null) {
        frameChanged =
          newDimensions.margins?.left !== $sudokuClues.dimensions.margins?.left ||
          newDimensions.margins?.right !== $sudokuClues.dimensions.margins?.right ||
          newDimensions.margins?.top !== $sudokuClues.dimensions.margins?.top ||
          newDimensions.margins?.bottom !== $sudokuClues.dimensions.margins?.bottom;
      } else {
        frameChanged = true;
      }
      if (frameChanged) {
        setMargins(newDimensions.margins);
      }
    }
  }
</script>

<div class="p-2">
  <div class="flex justify-center items-center w-full h-full p-2">
    <div class="grid grid-cols-2 grid-rows-3 gap-2">
      <div>
        <Input
          label="Rows"
          bind:value={rows}
          min="1"
          max="26"
          type="number"
          on:input={() => (columns = rows)}
        />
      </div>
      <div><Input label="Columns" bind:value={columns} min="1" max="26" type="number" /></div>
      <div>
        <Input label="Left Margin" bind:value={marginLeft} min="0" max="10" type="number" />
      </div>
      <div>
        <Input label="Right Margin" bind:value={marginRight} min="0" max="10" type="number" />
      </div>
      <div><Input label="Top Margin" bind:value={marginTop} min="0" max="10" type="number" /></div>
      <div>
        <Input label="Bottom Margin" bind:value={marginBottom} min="0" max="10" type="number" />
      </div>
    </div>
  </div>
  <Button class="mt-3 w-full" on:click={() => update()}>Update</Button>
</div>
