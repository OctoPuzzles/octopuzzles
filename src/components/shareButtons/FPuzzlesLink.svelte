<script lang="ts">
  export let puzzleData: string;
  let className = '';
  export { className as class };
</script>

<a
  class={className}
  title="Export to f-Puzzles.com"
  href="https://www.f-puzzles.com/?load={puzzleData}"
  target="_blank"
  rel="noreferrer noopener"><slot /></a
>
