<script lang="ts">
  export let text: string;
  let className = '';
  export { className as class };
</script>

<a
  class={className}
  title="WhatsApp"
  href="https://api.whatsapp.com/send?text={text}"
  target="_blank"
  rel="noreferrer noopener"><slot /></a
>
