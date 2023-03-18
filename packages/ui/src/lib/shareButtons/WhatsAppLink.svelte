<script lang="ts">
  import ExternalLink from '$lib/ui/ExternalLink.svelte';
  import WhatsappLogo from 'phosphor-svelte/lib/WhatsappLogo/WhatsappLogo.svelte';

  export let text: string;
  let className = '';
  export { className as class };
</script>

<ExternalLink class={className} title="WhatsApp" href="https://api.whatsapp.com/send?text={text}">
  <WhatsappLogo size={24} />
</ExternalLink>
