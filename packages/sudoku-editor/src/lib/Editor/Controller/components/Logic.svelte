<script lang="ts">
  import { Input, Checkbox, Label, Select } from '@octopuzzles/ui';
  import { editorHistory } from '$lib/sudokuStore';
  import { logicFlagNames, logicFlagsToLabel } from '$lib/constants';
  import type { DoublerType, Logic, LogicFlag, SCellType } from '@octopuzzles/models';
  import { addLabel } from '$lib/utils/addLabel';
  import { defaultDigits } from '@octopuzzles/sudoku-utils';

  const sudokuClues = editorHistory.subscribeToClues();

  let flags = $sudokuClues.logic.flags ?? [];
  $: nonstandard = flags.includes('NonStandard')!;
  $: diagonalPos = flags.includes('DiagonalPos');
  $: diagonalNeg = flags.includes('DiagonalNeg');
  $: antiknight = flags.includes('Antiknight');
  $: antiking = flags.includes('Antiking');
  $: nonconsecutive = flags.includes('Nonconsecutive');
  $: disjointsets = flags.includes('DisjointSets');
  $: sCells = flags.includes('SCells');
  $: doublers = flags.includes('Doublers');
  $: entropy = flags.includes('Entropy');
  $: indexed159 = flags.includes('Indexed159');
  $: negativeX = flags.includes('NegativeX');
  $: negativeV = flags.includes('NegativeV');
  $: negativeBlack = flags.includes('NegativeBlack');
  $: negativeWhite = flags.includes('NegativeWhite');

  let digits = defaultDigits($sudokuClues.logic, $sudokuClues.dimensions);

  $: sCellType = $sudokuClues.logic.sCellType ?? 'Sum';
  $: doublerType = $sudokuClues.logic.doublerType ?? 'Unique';

  const sCellTypes: SCellType[] = ['Sum', 'Average', 'NonStandard'];

  const sCellTypeLabels: Record<SCellType, string> = {
    Sum: 'Cell value is treated as the sum of the digits',
    Average: 'Cell value is treated as the average of the digits',
    NonStandard: 'SCells do not exhibit standard behaviour'
  };

  const doublerTypes: DoublerType[] = ['Unique', 'NonUnique', 'NonStandard'];

  const doublerTypeLabels: Record<DoublerType, string> = {
    Unique: 'Each digit must be doubled exactly once',
    NonUnique: 'Digits may be doubled more than once',
    NonStandard: 'Doublers do not exhibit standard behaviour'
  };

  function update(): void {
    //TODO: validate number of digits against grid dimensions, prompt for s-cells, or update digits when s-cells are selected
    const newLogic: Logic = {
      digits:
        digits !== defaultDigits($sudokuClues.logic, $sudokuClues.dimensions) ? digits : undefined,
      flags: flags.length > 0 ? flags : undefined,
      sCellType: flags.includes('SCells') ? sCellType : undefined,
      doublerType: flags.includes('Doublers') ? doublerType : undefined
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

    if (flagName === 'SCells') {
      digits = defaultDigits($sudokuClues.logic, $sudokuClues.dimensions);
    }

    update();

    addLabel(logicFlagsToLabel[flag]);
  }
</script>

<div class="grid grid-cols-1 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <Input label="Digits" bind:value={digits} placeholder="1-9" on:input={() => update()} />
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
            bind:checked={doublers}
            label={logicFlagNames.Doublers}
            on:change={() => toggleFlag('Doublers')}
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
    {#if sCells}
      <Select onChange={update} options={sCellTypes} bind:option={sCellType}>
        <svelte:fragment slot="label">S-Cell Type</svelte:fragment>
        <div slot="option" let:option>
          {sCellTypeLabels[option]}
        </div>
      </Select>
    {/if}
    {#if doublers}
      <Select onChange={update} options={doublerTypes} bind:option={doublerType}>
        <svelte:fragment slot="label">Doubler Type</svelte:fragment>
        <div slot="option" let:option>
          {doublerTypeLabels[option]}
        </div>
      </Select>
    {/if}
  </div>
</div>
