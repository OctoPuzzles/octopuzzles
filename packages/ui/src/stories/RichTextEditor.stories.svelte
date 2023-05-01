<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import RichTextEditor from '$lib/ui/RichTextEditor.svelte';
</script>

<Meta title="UI/RichTextEditor" component={RichTextEditor} />

<Template let:args>
  <RichTextEditor {...args} />
</Template>

<Story name="RichTextEditor" />
