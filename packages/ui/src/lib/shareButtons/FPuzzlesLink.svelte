<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import { FPuzzles } from '@octopuzzles/icons';

  export let puzzleData: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink
  class={className}
  title="Export to f-Puzzles.com"
  href="https://www.f-puzzles.com/?load={puzzleData}"
>
  <FPuzzles />
</ExternalLink>
