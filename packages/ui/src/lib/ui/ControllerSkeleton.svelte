<script lang="ts">
  import type { Numbers as NumbersIcon } from '@octopuzzles/icons';
  import classNames from 'classnames';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';

  export let menuItems: {
    icon: typeof NumbersIcon;
    onClick: () => void;
    title: string;
    shortcut?: string;
    isSelected: boolean;
  }[];

  let showHelpModal = false;
</script>

<div class="flex flex-col gap-2">
  <div
    class="grid grid-rows-7 sm:grid-rows-6 grid-cols-5 sm:grid-cols-6 max-w-96 sm:w-120 h-140 sm:h-120 relative bg-gray-200 gap-px"
  >
    <div class="absolute -top-3 -right-3">
      <button
        class="bg-gray-500/10 hover:bg-orange-500 hover:text-white rounded-full w-6 h-6 transition-colors"
        title="Help"
        on:click={() => (showHelpModal = true)}
      >
        ?
      </button>
    </div>
    <!-- Main control container -->
    <div class="row-span-5 col-span-6 sm:col-span-5 bg-gray-100">
      <slot name="main" />
    </div>

    <!-- Rightmost controls -->
    <div
      class="row-span-1 col-span-5 sm:row-span-6 sm:col-span-1 bg-gray-100 flex flex-row sm:flex-col items-center gap-2 px-2 sm:py-2 overflow-x-scroll sm:overflow-y-scroll"
    >
      {#each menuItems as { icon, onClick, title, shortcut, isSelected }}
        <button
          class={classNames(
            'w-14 h-14 p-1 rounded',
            isSelected ? 'bg-gray-700/10 shadow-inner' : 'bg-transparent hover:bg-gray-200'
          )}
          data-testid={title}
          on:click={() => onClick()}
          title={`${title}${shortcut ? ` (${shortcut})` : ''}`}
        >
          <svelte:component this={icon} />
        </button>
      {/each}
    </div>

    <!-- Bottom Controls -->
    <div class="row-span-1 col-span-6 sm:col-span-5 flex justify-evenly bg-gray-100 items-center">
      <slot name="bottom" />
    </div>
  </div>

  <!-- Aux Controls -->
  <div class="row-span-1 col-span-6 sm:col-span-5 flex justify-evenly items-center">
    <slot name="aux" />
  </div>
</div>

<Modal bind:isOpen={showHelpModal} let:close>
  <div class="p-4">
    <slot name="helpModalContent" />

    <div class="flex gap-2">
      <Button class="w-full" variant="primary" on:click={() => close()}>Okay</Button>
    </div>
  </div>
</Modal>
