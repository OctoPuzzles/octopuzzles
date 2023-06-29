<script lang="ts">
  import classNames from 'classnames';

  export let id: string | undefined = undefined;
  export let required = false;
  let className = '';
  export { className as class };
</script>

<label
  {...$$props}
  for={id}
  class={classNames('block text-sm leading-5 mb-1 text-gray-700', className)}
>
  <slot />
  {#if required}
    *
  {/if}
</label>
