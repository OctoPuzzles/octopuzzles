<script lang="ts">
  export let url: string;
  export let text: string;
  let className = '';
  export { className as class };
</script>

<a
  class={className}
  title="Twitter"
  href="https://www.twitter.com/share?url={url}&text={text}"
  target="_blank"
  rel="noreferrer noopener"><slot /></a
>
