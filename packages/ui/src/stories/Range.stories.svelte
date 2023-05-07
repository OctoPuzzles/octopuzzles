<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import Range from '$lib/ui/Range.svelte';
</script>

<Meta
  title="UI/Range"
  component={Range}
  argTypes={{
    label: { control: 'text' },
    id: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: 'number' }
  }}
/>

<Template let:args>
  <Range {...args} />
</Template>

<Story name="Range" args={{ label: 'Range', min: 0, max: 10, value: 5, step: 1, id: 'my-range' }} />
