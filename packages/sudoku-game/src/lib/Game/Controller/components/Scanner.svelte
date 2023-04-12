<script lang="ts">
  import { SquareButton, Label, RadioGroup, Checkbox } from '@octopuzzles/ui';
  import Play from 'phosphor-svelte/lib/Play/Play.svelte';
  import Pause from 'phosphor-svelte/lib/Pause/Pause.svelte';
  import { Step } from '@octopuzzles/icons';
  import Atom from 'phosphor-svelte/lib/Atom/Atom.svelte';
  import { cageDefaults, pathDefaults, regionDefaults } from '@octopuzzles/sudoku-utils';
  import type {
    ScannerHighlightMode,
    ScannerMode,
    ScannerSettings,
    ScannerSpeed
  } from '@octopuzzles/models';
  import { scanner } from '$lib/sudokuStore/scanner';
  import { gameHistory } from '$lib/sudokuStore';
  import { getContext } from 'svelte';
  import { gameAction } from '$lib/gameAction';

  let onScannerSettingsChange: (newSettings: ScannerSettings) => void =
    getContext('updateScannerSettings');

  let scannerSettings = scanner.scannerSettings;
  let highlightMode = $scannerSettings.highlightMode ?? 'None';
  let mode = $scannerSettings.mode ?? 'Basic';
  let autoScan = $scannerSettings.autoScan ?? false;
  let scannerSpeed = $scannerSettings.scannerSpeed ?? 'Slow';
  let useCentreMarks = $scannerSettings.useCentreMarks ?? true;
  let useCornerMarks = $scannerSettings.useCornerMarks ?? true;
  let scanDiagonals = $scannerSettings.scanDiagonals ?? true;
  let scanAntiKnight = $scannerSettings.scanAntiKnight ?? true;
  let scanAntiKing = $scannerSettings.scanAntiKing ?? true;
  let scanDisjointSets = $scannerSettings.scanDisjointSets ?? true;
  let scanCages = $scannerSettings.scanCages ?? true;
  let scanPaths = $scannerSettings.scanPaths ?? true;
  let scanExtraRegions = $scannerSettings.scanExtraRegions ?? true;
  let scanNegativeXV = $scannerSettings.scanNegativeXV ?? true;
  let scanNegativeKropki = $scannerSettings.scanNegativeKropki ?? true;
  let scanNonConsecutive = $scannerSettings.scanNonConsecutive ?? true;

  const sudokuClues = gameHistory.clues;

  let flags = $sudokuClues.logic.flags ?? [];
  let diagonalPos = flags.includes('DiagonalPos');
  let diagonalNeg = flags.includes('DiagonalNeg');
  let antiknight = flags.includes('Antiknight');
  let antiking = flags.includes('Antiking');
  let disjointsets = flags.includes('DisjointSets');
  let nonconsecutive = flags.includes('Nonconsecutive');
  //let entropy = flags.includes('Entropy');
  let negativeX = flags.includes('NegativeX');
  let negativeV = flags.includes('NegativeV');
  let negativeBlack = flags.includes('NegativeBlack');
  let negativeWhite = flags.includes('NegativeWhite');

  function updateSettings(): void {
    const newScannerSettings: ScannerSettings = {
      highlightMode: highlightMode as ScannerHighlightMode,
      mode: mode as ScannerMode,
      scannerSpeed: scannerSpeed as ScannerSpeed,
      autoScan,
      useCentreMarks,
      useCornerMarks,
      scanDiagonals,
      scanAntiKnight,
      scanAntiKing,
      scanDisjointSets,
      scanCages,
      scanPaths,
      scanExtraRegions,
      scanNegativeXV,
      scanNegativeKropki,
      scanNonConsecutive
    };
    onScannerSettingsChange(newScannerSettings);

    scanner.configure(newScannerSettings);
  }

  function handleKeyboardShortcuts(k: KeyboardEvent): void {
    //ensure settings controls are in sync with the scanner configuration
    switch (k.key) {
      case 'h': {
        if (highlightMode !== 'Seen') {
          highlightMode = 'Seen';
        } else {
          highlightMode = 'None';
        }
        break;
      }
      case 't': {
        if (highlightMode !== 'Tuples') {
          highlightMode = 'Tuples';
        } else {
          highlightMode = 'None';
        }
        break;
      }
    }
  }
</script>

<svelte:window use:gameAction={{ onKeyDown: handleKeyboardShortcuts }} />

<div class="grid grid-cols-1 w-full h-full p-2">
  <div class="px-2 flex flex-col overflow-hidden justify-between">
    <div>
      <Label id="highlight">Highlighting</Label>
      <RadioGroup
        options={['None', 'Seen', 'Tuples']}
        bind:value={highlightMode}
        name="HighlightMode"
        let:option
        idFromOption={(o) => o}
        onChange={() => updateSettings()}
      >
        {option}
      </RadioGroup>
    </div>
    <div>
      <Label id="mode">Options</Label>
      <RadioGroup
        options={['Basic', 'Advanced', 'Extreme']}
        bind:value={mode}
        let:option
        name="Mode"
        idFromOption={(o) => o}
        onChange={() => updateSettings()}
      >
        {option}
      </RadioGroup>
    </div>

    <div
      class="bg-gray-200 rounded-md shadow-inner flex flex-col items-center p-2 overflow-hidden h-full"
    >
      <div class="h-full overflow-y-auto w-full">
        <div>
          <Checkbox
            bind:checked={useCentreMarks}
            label="Use Centre Marks"
            on:change={() => {
              useCentreMarks = !useCentreMarks;
              updateSettings();
            }}
          />
        </div>
        <div>
          <Checkbox
            bind:checked={useCornerMarks}
            label="Use Corner Marks"
            on:change={() => {
              useCornerMarks = !useCornerMarks;
              updateSettings();
            }}
          />
        </div>
        {#if mode !== 'Basic'}
          {#if diagonalPos || diagonalNeg}
            <div>
              <Checkbox
                bind:checked={scanDiagonals}
                label="Scan Diagonals"
                on:change={() => {
                  scanDiagonals = !scanDiagonals;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if antiknight}
            <div>
              <Checkbox
                bind:checked={scanAntiKnight}
                label="Scan Anti-Knight"
                on:change={() => {
                  scanAntiKnight = !scanAntiKnight;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if antiking}
            <div>
              <Checkbox
                bind:checked={scanAntiKing}
                label="Scan Anti-King"
                on:change={() => {
                  scanAntiKing = !scanAntiKing;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if disjointsets}
            <div>
              <Checkbox
                bind:checked={scanDisjointSets}
                label="Scan Disjoint Sets"
                on:change={() => {
                  scanDisjointSets = !scanDisjointSets;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if $sudokuClues.extendedcages.some((c) => c.uniqueDigits ?? cageDefaults(c.type ?? 'CUSTOM').uniqueDigits)}
            <div>
              <Checkbox
                bind:checked={scanCages}
                label="Scan Cages"
                on:change={() => {
                  scanCages = !scanCages;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if $sudokuClues.paths.some((l) => l.uniqueDigits ?? pathDefaults(l.type ?? 'CUSTOM').uniqueDigits)}
            <div>
              <Checkbox
                bind:checked={scanPaths}
                label="Scan Paths"
                on:change={() => {
                  scanPaths = !scanPaths;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if $sudokuClues.regions.some((r) => (r.type ?? 'CUSTOM') !== 'Normal' && (r.uniqueDigits ?? regionDefaults(r.type ?? 'CUSTOM').uniqueDigits))}
            <div>
              <Checkbox
                bind:checked={scanExtraRegions}
                label="Scan Extra Regions"
                on:change={() => {
                  scanExtraRegions = !scanExtraRegions;
                  updateSettings();
                }}
              />
            </div>
          {/if}
        {/if}
        {#if mode === 'Extreme'}
          {#if negativeX || negativeV}
            <div>
              <Checkbox
                bind:checked={scanNegativeXV}
                label="Scan Negative XV"
                on:change={() => {
                  scanNegativeXV = !scanNegativeXV;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if negativeBlack || negativeWhite}
            <div>
              <Checkbox
                bind:checked={scanNegativeKropki}
                label="Scan Negative Kropki"
                on:change={() => {
                  scanNegativeKropki = !scanNegativeKropki;
                  updateSettings();
                }}
              />
            </div>
          {/if}
          {#if nonconsecutive}
            <div>
              <Checkbox
                bind:checked={scanNonConsecutive}
                label="Scan Non-Consecutive"
                on:change={() => {
                  scanNonConsecutive = !scanNonConsecutive;
                  updateSettings();
                }}
              />
            </div>
          {/if}
        {/if}
      </div>
    </div>
    <div>
      <Label id="mode">Speed</Label>
      <RadioGroup
        options={['Slow', 'Fast', 'Instant']}
        bind:value={scannerSpeed}
        idFromOption={(o) => o}
        let:option
        name="Scanner speed"
        onChange={() => updateSettings()}
      >
        {option}
      </RadioGroup>
    </div>

    <div class="grid grid-cols-4 grid-rows-1 h-max w-max m-auto p-1 gap-4">
      <SquareButton text="Step" on:click={() => scanner.step()}>
        <Step />
      </SquareButton>
      <SquareButton text="Scan" on:click={() => scanner.startScan()}>
        <Play size={64} weight="thin" />
      </SquareButton>
      <SquareButton text="Stop" on:click={() => scanner.stopScan()}>
        <Pause size={64} weight="thin" />
      </SquareButton>
      <SquareButton
        text="Auto"
        disabled={false}
        variant={autoScan ? 'secondary' : 'default'}
        on:click={() => {
          autoScan = !autoScan;
          updateSettings();
        }}
      >
        <Atom size={64} weight="thin" />
      </SquareButton>
    </div>
  </div>
</div>
