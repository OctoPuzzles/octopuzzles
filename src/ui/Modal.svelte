<script lang="ts">
	import { modals, exitBeforeEnter, transitioning, closeModal } from '$stores/modalStore';
	import { fade } from 'svelte/transition';
</script>

<!--
@component
How to:

@example
```
<script>
 import { openModal } from 'ui';
 import { MyModal } from './MyModal.svelte';

 function handleClick() {
		 openModal(MyModal, { title: "Some Title" });
 }
</script>

<button on:click={handleClick}>Open Modal</button>
```

```
// MyModal.svelte
<script>
 import { closeModal, closeAllModals, openModal, modals } from 'ui'

 export let isOpen;
 export let title;
</script>

{#if isOpen}
 <div role="dialog">
		 // ...
		 <button on:click={closeModal}>Close Modal</button>
 </div>
{/if}
```

Finally, in your __layout.svelte file, you need to write
```
<Modal />
```
-->

{#if $modals.length > 0}
	<div
		on:click={closeModal}
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-40 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" aria-hidden="true" />

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"
				>&#8203;</span
			>

			<slot>
				{#each $modals as modal, i (i)}
					<div
						on:click|stopPropagation
						class="z-50 inline-block transform overflow-hidden rounded-md bg-transparent text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle"
					>
						<svelte:component
							this={modal.component}
							isOpen={i === $modals.length - 1 && !$transitioning}
							on:introstart={() => {
								$exitBeforeEnter = true;
							}}
							on:outroend={() => {
								$transitioning = false;
							}}
							{...modal.props || {}}
						/>
					</div>
				{/each}
			</slot>
		</div>
	</div>
{/if}
