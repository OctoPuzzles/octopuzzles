<script lang="ts">
  export let puzzleData: string;
  let className = '';
  export { className as class };
</script>

Cracking the Cryptic
<a
  class={className}
  title="Cracking The Cryptic"
  href="https://app.crackingthecryptic.com/sudoku/?puzzleid=fpuzzles{puzzleData}"
  target="_blank"
  rel="noreferrer noopener"><slot /></a
>
