<script lang="ts">
  import type { Paths } from '@octopuzzles/models';
  import Path from './Path.svelte';

  export let paths: Paths;
</script>

{#if paths.length > 0}
  <g id="paths" class="opacity-60 select-none pointer-events-none">
    {#each paths as path}
      <Path {path} />
    {/each}
  </g>
{/if}
