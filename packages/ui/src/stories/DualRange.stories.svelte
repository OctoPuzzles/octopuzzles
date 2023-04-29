<script>
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import DualRange from '$lib/ui/DualRange.svelte';
</script>

<Meta title="UI/DualRange" component={DualRange} />

<Template let:args>
  <DualRange {...args} />
</Template>

<Story
  name="DualRange"
  args={{
    min: 0,
    max: 5,
    values: [1, 4],
    all: 'label',
    formatter: (v) => {
      return v === 0 ? 'No difficulty' : v;
    }
  }}
/>
