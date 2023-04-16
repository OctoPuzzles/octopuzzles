<script lang="ts">
  import type { PenTool } from '@octopuzzles/models';
  import PenToolComponent from './PenTool.svelte';

  export let pentools: PenTool[] | null | undefined;
</script>

{#if pentools && pentools.length > 0}
  <g id="pentools" class="opacity-60 select-none pointer-events-none">
    {#each pentools as pentool}
      {#if pentool.positions.length > 0}
        <PenToolComponent {pentool} />
      {/if}
    {/each}
  </g>
{/if}
