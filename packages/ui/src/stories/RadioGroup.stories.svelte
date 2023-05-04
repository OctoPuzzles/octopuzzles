<script lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
  import RadioGroup from '$lib/ui/RadioGroup.svelte';

  function idFromOption(option: string): string {
    return option;
  }
</script>

<Meta title="UI/RadioGroup" component={RadioGroup} />

<Template let:args>
  <RadioGroup {...args} let:option>
    <div>{option}</div>
  </RadioGroup>
</Template>

<Story
  name="RadioGroup"
  args={{
    name: 'My radio group',
    options: ['a', 'b', 'c'],
    idFromOption,
    value: 'a',
    id: 'my-radio-group'
  }}
/>
