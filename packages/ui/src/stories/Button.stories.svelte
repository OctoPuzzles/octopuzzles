<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Button from '$lib/ui/Button.svelte';
</script>

<Meta
  title="UI/Button"
  component={Button}
  argTypes={{
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'subtle', 'default', 'danger']
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }}
/>

<Template let:args>
  <Button {...args}>Button</Button>
</Template>

<Story name="Button" args={{ variant: 'primary' }} />
