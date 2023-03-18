<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import RedditLogo from 'phosphor-svelte/lib/RedditLogo/RedditLogo.svelte';

  export let url: string;
  export let text: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink
  class={className}
  title="Reddit"
  href="https://www.reddit.com/submit?url={url}&title={text}"
>
  <RedditLogo size={24} />
</ExternalLink>
