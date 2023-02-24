<script lang="ts">
  import classNames from 'classnames';

  type ButtonVariant = 'default' | 'primary' | 'secondary';

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
  /** Text */
  export let text = '';
  /**
   * What version to use, e.g. primary/secondary/...
   */
  export let variant: ButtonVariant | 'customColor' = 'default';

  $: faded = disabled || loading;

  $: variantClasses = {
    primary: classNames('border-transparent', {
      'bg-orange-500 hover:bg-orange-400 active:bg-orange-600': !faded,
      'bg-gray-300': faded
    }),
    secondary: classNames('border-transparent', {
      'bg-blue-500 hover:bg-blue-400 active:bg-blue-800 text-white': !faded,
      'bg-gray-100 text-gray-500': faded
    }),
    default: classNames('border-gray-300', {
      'text-gray-700 bg-white hover:bg-gray-100 active:text-gray-700 active:bg-gray-100': !faded,
      'bg-gray-100 text-gray-500': faded
    }),
    customColor: 'hover:border-current hover:ring hover:ring-current'
  };
</script>

<button
  on:click
  {...$$props}
  {disabled}
  class={classNames(
    'group inline-flex flex-col items-center justify-center border focus:outline-none transition ease-in-out duration-150 leading-1 w-16 h-16 rounded-md',
    {
      'cursor-not-allowed': faded
    },
    variantClasses[variant],
    className
  )}
>
  <slot />
  <span class="w-16 text-xs">{text}</span>
</button>
