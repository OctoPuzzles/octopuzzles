<script lang="ts">
  export let url: string;
  let className = '';
  export { className as class };
</script>

<a
  class={className}
  title="Facebook"
  href="https://www.facebook.com/sharer/sharer.php?u={url}"
  target="_blank"
  rel="noreferrer noopener"><slot /></a
>
