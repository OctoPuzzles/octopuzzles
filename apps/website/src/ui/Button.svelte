<script lang="ts">
  import classNames from 'classnames';
  import LoadingIndicator from '$ui/LoadingIndicator.svelte';

  type ButtonVariant = 'default' | 'primary' | 'secondary' | 'subtle' | 'danger';

  // PROPS //
  /** Class override */
  let className = '';
  export { className as class };
  /**
   * Display a loading indicator. This also disables the button
   */
  export let loading = false;
  /** Whether or not the button is disabled */
  export let disabled = false;
  /**
   * What version to use, e.g. primary/secondary/...
   */
  export let variant: ButtonVariant = 'default';

  $: faded = disabled || loading;

  // Force removal of loading spinner
  let spinner: LoadingIndicator;
  $: loading === false && spinner && spinner.$destroy();

  $: baseClasses = classNames(
    'group inline-flex items-center justify-center border focus:outline-none transition ease-in-out duration-150 leading-5 px-4 py-2 rounded-md',
    {
      'cursor-not-allowed': faded
    }
  );

  $: variantClasses = {
    primary: classNames('border-transparent', {
      'bg-orange-500 hover:bg-orange-400 active:bg-orange-600': !faded,
      'bg-gray-300': faded
    }),
    secondary: classNames('border-transparent', {
      'bg-blue-500 hover:bg-blue-400 active:bg-blue-800 text-white': !faded,
      'bg-gray-100 text-gray-500 border-gray-300': faded
    }),
    default: classNames('border-gray-300 font-medium', {
      'text-gray-700 bg-white hover:bg-gray-100 active:text-gray-700 active:bg-gray-100': !faded,
      'bg-gray-100 text-gray-500': faded
    }),
    danger: classNames('border-transparent text-white', {
      'bg-red-600 hover:bg-red-500 active:bg-red-700': !faded,
      'bg-gray-100 text-gray-500': faded
    }),
    subtle: classNames('border-transparent bg-none text-gray-600', {
      'hover:text-gray-700 hover:bg-gray-200': !faded
    })
  };
</script>

<button
  {...$$props}
  {disabled}
  on:click
  class={classNames(baseClasses, variantClasses[variant], className)}
>
  {#if loading}
    <div class="absolute">
      <LoadingIndicator class="w-6" bind:this={spinner} />
    </div>
  {/if}
  <div
    class={classNames('items-center', {
      'opacity-75': faded,
      invisible: loading
    })}
  >
    <slot />
  </div>
</button>
