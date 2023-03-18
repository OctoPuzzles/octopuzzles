<script lang="ts">
  let className = '';
  export { className as class };
  export let href: string;
  export let title: string;
</script>

<a class={className} {title} {href} target="_blank" rel="noreferrer noopener"><slot /></a>
