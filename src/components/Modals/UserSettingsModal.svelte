<script lang="ts">
	import type { VerificationMode } from '$models/UserSettings';
	import { settings } from '$stores/settingsStore';
	import Label from '$ui/Label.svelte';
	import RadioGroup from '$ui/RadioGroup.svelte';

	export let isOpen: boolean;

	const generalSettings = settings.getGroup('general');
	let verificationMode = $generalSettings?.verificationMode ?? 'OnComplete';

	function updateSettings(): void {
		const generalSettings = {
			verificationMode: verificationMode as VerificationMode
		};
		settings.save({ general: generalSettings });
	}
</script>

{#if isOpen}
	<div role="dialog" class="bg-white shadow rounded-md p-4 flex flex-col">
		<div class="grid grid-cols-1 w-full h-full p-2">
			<div class="px-2 flex flex-col overflow-hidden justify-between">
				<div>
					<Label id="highlightErrors">Show Error Cells</Label>
					<RadioGroup
						options={['OnInput', 'OnComplete', 'OnDemand']}
						bind:value={verificationMode}
						name="VerificationMode"
						let:option
						idFromOption={(o) => o}
						onChange={() => updateSettings()}
					>
						{option}
					</RadioGroup>
				</div>
			</div>
		</div>
	</div>
{/if}
