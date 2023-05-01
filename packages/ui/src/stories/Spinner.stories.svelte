<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Spinner from '$lib/ui/Spinner.svelte';
</script>

<Meta title="UI/Spinner" component={Spinner} />

<Template let:args>
  <div class="w-20 h-20">
    <Spinner {...args} />
  </div>
</Template>

<Story name="Spinner" />
