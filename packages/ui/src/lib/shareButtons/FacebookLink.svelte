<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import FacebookLogo from 'phosphor-svelte/lib/FacebookLogo/FacebookLogo.svelte';

  export let url: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink
  class={className}
  title="Facebook"
  href="https://www.facebook.com/sharer/sharer.php?u={url}"
>
  <FacebookLogo size={24} />
</ExternalLink>
