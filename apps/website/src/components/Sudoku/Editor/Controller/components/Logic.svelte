<script lang="ts">
  import { Input, Checkbox, Label } from '@octopuzzles/ui';
  import { editorHistory } from '$stores/sudokuStore';
  import { logicFlagNames, logicFlagsToLabel } from '$constants';
  import type { Logic, LogicFlag } from '@octopuzzles/models';

  const sudokuClues = editorHistory.subscribeToClues();
  const labels = editorHistory.labels;

  let digits = $sudokuClues.logic.digits ?? '1-9';
  let flags = $sudokuClues.logic.flags ?? [];
  $: nonstandard = flags.indexOf('NonStandard') !== -1;
  $: diagonalPos = flags.indexOf('DiagonalPos') !== -1;
  $: diagonalNeg = flags.indexOf('DiagonalNeg') !== -1;
  $: antiknight = flags.indexOf('Antiknight') !== -1;
  $: antiking = flags.indexOf('Antiking') !== -1;
  $: nonconsecutive = flags.indexOf('Nonconsecutive') !== -1;
  $: disjointsets = flags.indexOf('DisjointSets') !== -1;
  $: sCells = flags.indexOf('SCells') !== -1;
  $: entropy = flags.indexOf('Entropy') !== -1;
  $: indexed159 = flags.indexOf('Indexed159') !== -1;
  $: negativeX = flags.indexOf('NegativeX') !== -1;
  $: negativeV = flags.indexOf('NegativeV') !== -1;
  $: negativeBlack = flags.indexOf('NegativeBlack') !== -1;
  $: negativeWhite = flags.indexOf('NegativeWhite') !== -1;

  function update(): void {
    //TODO: validate number of digits against grid dimensions, prompt for s-cells, or update digits when s-cells are selected
    const newLogic: Logic = {
      digits: digits !== '' ? digits : undefined,
      flags: flags.length > 0 ? flags : undefined
    };

    editorHistory.set({ logic: newLogic });
  }

  function toggleFlag(flagName: LogicFlag) {
    const flag = flagName;

    let index = flags.indexOf(flag);
    if (index === -1) {
      flags.push(flag);
    } else {
      flags.splice(index, 1);
    }

    update();

    const label = $labels.find((l) => l.label.name === logicFlagsToLabel[flag]);
    if (label) {
      label.selected = true;
    }
  }
</script>

<div class="grid grid-cols-1 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <Input label="Digits" bind:value={digits} placeholder="1-9" />
    <Label>Flags</Label>
    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        <div>
          <Checkbox
            bind:checked={nonstandard}
            label={logicFlagNames.NonStandard}
            on:change={() => toggleFlag('NonStandard')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={diagonalPos}
            label={logicFlagNames.DiagonalPos}
            on:change={() => toggleFlag('DiagonalPos')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={diagonalNeg}
            label={logicFlagNames.DiagonalNeg}
            on:change={() => toggleFlag('DiagonalNeg')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={disjointsets}
            label={logicFlagNames.DisjointSets}
            on:change={() => toggleFlag('DisjointSets')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={antiknight}
            label={logicFlagNames.Antiknight}
            on:change={() => toggleFlag('Antiknight')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={antiking}
            label={logicFlagNames.Antiking}
            on:change={() => toggleFlag('Antiking')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={nonconsecutive}
            label={logicFlagNames.Nonconsecutive}
            on:change={() => toggleFlag('Nonconsecutive')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={negativeX}
            label={logicFlagNames.NegativeX}
            on:change={() => toggleFlag('NegativeX')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={negativeV}
            label={logicFlagNames.NegativeV}
            on:change={() => toggleFlag('NegativeV')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={negativeBlack}
            label={logicFlagNames.NegativeBlack}
            on:change={() => toggleFlag('NegativeBlack')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={negativeWhite}
            label={logicFlagNames.NegativeWhite}
            on:change={() => toggleFlag('NegativeWhite')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={indexed159}
            label={logicFlagNames.Indexed159}
            on:change={() => toggleFlag('Indexed159')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={sCells}
            label={logicFlagNames.SCells}
            on:change={() => toggleFlag('SCells')}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={entropy}
            label={logicFlagNames.Entropy}
            on:change={() => toggleFlag('Entropy')}
          />
        </div>
      </div>
    </div>
  </div>
</div>
