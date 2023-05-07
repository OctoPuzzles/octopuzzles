<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Checkbox from '$lib/ui/Checkbox.svelte';
</script>

<Meta
  title="UI/Checkbox"
  component={Checkbox}
  argTypes={{
    label: { control: 'text' },
    checked: { control: 'boolean' }
  }}
/>

<Template let:args>
  <Checkbox {...args} />
</Template>

<Story name="Checkbox" args={{ label: 'Checkbox' }} />
