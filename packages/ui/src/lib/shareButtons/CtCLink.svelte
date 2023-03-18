<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import { CtC } from '@octopuzzles/icons';

  export let puzzleData: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink
  class={className}
  title="Cracking The Cryptic"
  href="https://app.crackingthecryptic.com/sudoku/?puzzleid=fpuzzles{puzzleData}"
>
  <CtC />
</ExternalLink>
