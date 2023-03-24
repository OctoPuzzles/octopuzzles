<script lang="ts">
  import type { Numbers as NumbersIcon } from '@octopuzzles/icons';
  import classNames from 'classnames';

  export let menuItems: {
    icon: typeof NumbersIcon;
    onClick: () => void;
    title: string;
    shortcut?: string;
    isSelected: boolean;
  }[];
</script>

<div class="flex flex-col gap-2">
  <div
    class="grid grid-rows-7 sm:grid-rows-6 grid-cols-5 sm:grid-cols-6 max-w-96 sm:w-120 h-140 sm:h-120 relative bg-gray-200 gap-px"
  >
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
