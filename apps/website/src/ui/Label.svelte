<script lang="ts">
  import classNames from 'classnames';

  export let id: string | undefined = undefined;
  let className = '';
  export { className as class };
</script>

<label
  {...$$props}
  for={id}
  class={classNames('block text-sm leading-5 mb-1 text-gray-700', className)}
>
  <slot />
</label>
