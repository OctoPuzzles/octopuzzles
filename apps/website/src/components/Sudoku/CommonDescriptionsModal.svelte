<script lang="ts">
  import { Modal, Button } from '@octopuzzles/ui';
  import Plus from 'phosphor-svelte/lib/Plus/Plus.svelte';
  import Check from 'phosphor-svelte/lib/Check/Check.svelte';
  import classNames from 'classnames';
  import type { Label } from '@octopuzzles/models';

  export let isOpen: boolean;
  export let currentDescription: string;
  export let addLabel: (label: Label) => string;
  export let labels: { label: Label; selected: boolean }[];

  let previewedDescription = labels[0].label.description;
</script>

<Modal let:close bind:isOpen>
  <div class="w-full p-4 border-b border-gray-300">
    <h2 class="text-2xl font-semibold">Add common descriptions</h2>
  </div>
  <div class="flex h-80">
    <ul class="flex flex-col gap-px border-r border-gray-300 overflow-y-auto w-96 h-full">
      {#each labels as item, i}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class={classNames(
            'py-2 px-4 w-full flex justify-between items-center cursor-pointer bg-white',
            { 'border-t border-gray-300': i !== 0 },
            previewedDescription === item.label.description && 'text-orange-500'
          )}
          on:click={() => (previewedDescription = item.label.description)}
        >
          <p>{item.label.name}</p>
          <button
            class={classNames(
              'p-1 w-6 h-6 rounded-full flex items-center justify-center',
              item.selected === true
                ? 'bg-green-200 text-green-500'
                : 'transition-colors bg-gray-100 hover:bg-gray-200 '
            )}
            on:click={() => {
              if (item.selected === true) return;
              currentDescription = addLabel(item.label);
            }}
          >
            {#if item.selected}
              <Check size={24} />
            {:else}
              <Plus size={24} />
            {/if}
          </button>
        </li>
      {/each}
    </ul>
    <div class="w-96 h-full p-2">
      <p>{previewedDescription}</p>
    </div>
  </div>

  <div class="w-full p-4 border-t border-gray-300 flex justify-end">
    <Button variant="primary" on:click={close}>Done</Button>
  </div>
</Modal>
