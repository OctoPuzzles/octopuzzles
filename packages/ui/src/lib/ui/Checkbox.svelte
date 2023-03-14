<script lang="ts">
  export let label: string;
  export let checked: boolean;
</script>

<label class="inline-flex items-center mt-3">
  <input
    {...$$props}
    on:change
    type="checkbox"
    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 cursor-pointer focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-auto"
    bind:checked
  />
  <span class="ml-2 text-gray-700">{label}</span>
</label>
