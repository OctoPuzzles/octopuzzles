<script lang="ts">
  import { page } from '$app/stores';
  import Logo from '$icons/Logo.svelte';
  import HeaderDropdown from './HeaderDropdown.svelte';

  $: isSudokuPage = $page.url.pathname.startsWith('/sudoku');
</script>

<header class="flex items-center justify-between h-20">
  <a href="/" class="m-2">
    <div class="hidden sm:block">
      <Logo withText size={140} />
    </div>
    <div class="block sm:hidden"><Logo withText={false} size={140} /></div>
  </a>
  <div class={isSudokuPage ? 'hidden sm:block' : ''}>
    <HeaderDropdown />
  </div>
</header>
