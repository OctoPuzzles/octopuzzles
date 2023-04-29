<script lang="ts">
  import type { Annotations } from '@octopuzzles/models';
  import PenToolComponent from './PenTool.svelte';

  export let pentools: Annotations | null | undefined;
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
