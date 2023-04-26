<script lang="ts">
  import SquareButton from './SquareButton.svelte';
  import Backspace from 'phosphor-svelte/lib/Backspace/Backspace.svelte';
  import classNames from 'classnames';

  export let getButtonInfo:
    | ((key: string) => { class?: string; custom?: boolean; disabled?: boolean })
    | undefined = undefined;
  export let handleButtonClick: ((key: string) => void) | undefined = undefined;

  export let extraKey: string | undefined = undefined;
  export let extraKeyDescription: string | undefined = undefined;
</script>

<!--TODO: toggle for alpha input-->
<div class="w-full h-full flex justify-center items-center">
  <div class="grid grid-cols-3 grid-rows-4 h-max w-max m-auto p-4 gap-4">
    {#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as key}
      {@const buttonInfo = getButtonInfo ? getButtonInfo(key) : undefined}
      <div>
        <SquareButton
          variant={buttonInfo?.custom ? 'custom' : 'secondary'}
          class={buttonInfo?.class ?? 'text-3xl'}
          title={key}
          disabled={buttonInfo?.disabled ?? false}
          on:click={() => {
            if (handleButtonClick) handleButtonClick(key);
          }}><slot name="digit" digit={key} /></SquareButton
        >
      </div>
    {/each}
    <div
      class={classNames({
        'col-span-2': !extraKey
      })}
    >
      <SquareButton
        class={classNames('p-3', {
          'w-36': !extraKey
        })}
        on:click={() => {
          if (handleButtonClick) handleButtonClick('');
        }}
        title="Clear"
      >
        <Backspace size={32} />
      </SquareButton>
    </div>
    {#if extraKey}
      {@const key = extraKey}
      {@const title = extraKeyDescription ?? key}
      <SquareButton
        class="text-3xl"
        on:click={() => {
          if (handleButtonClick) handleButtonClick(key);
        }}
        {title}
      >
        {key}
      </SquareButton>
    {/if}
  </div>
</div>
