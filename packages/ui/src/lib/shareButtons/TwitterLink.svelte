<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo/TwitterLogo.svelte';

  export let url: string;
  export let text: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink
  class={className}
  title="Twitter"
  href="https://www.twitter.com/share?url={url}&text={text}"
>
  <TwitterLogo size={24} />
</ExternalLink>
