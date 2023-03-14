<script lang="ts">
  import type { Borderclues } from '@octopuzzles/models';
  import { default as BorderclueComponent } from './Borderclue.svelte';

  export let borderClues: Borderclues;
</script>

{#if borderClues.length > 0}
  <g id="borderclues">
    {#each borderClues as borderclue}
      <BorderclueComponent {borderclue} />
    {/each}
  </g>
{/if}
