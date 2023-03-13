<script lang="ts">
  import Logo from '$icons/Logo.svelte';
</script>

<footer class="flex items-center justify-between bg-gray-100 border-t py-20 px-4 md:px-20">
  <a href="/">
    <Logo size={200} />
  </a>
  <div>
    <h6 class="text-xl">Links</h6>
    <nav>
      <ul>
        <li>
          <a
            class="hover:underline"
            href="https://github.com/OctoPuzzles/octopuzzles"
            target="_blank"
            rel="noopener noreferrer">GitHub / Open Source</a
          >
        </li>
        <li><a class="hover:underline" href="/sudoku/editor">Create a sudoku</a></li>
        <li><a class="hover:underline" href="/sudoku/editor?import=true">Import a sudoku</a></li>
        <li><a class="hover:underline" href="/terms-and-conditions">Terms and conditions</a></li>
      </ul>
    </nav>
  </div>
</footer>
