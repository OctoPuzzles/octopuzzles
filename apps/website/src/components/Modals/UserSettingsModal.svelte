<script lang="ts">
  import type { VerificationMode } from '@octopuzzles/models';
  import { settings } from '$stores/settingsStore';
  import { Button, Label, Modal, RadioGroup } from '@octopuzzles/ui';

  export let isOpen: boolean;

  const generalSettings = settings.getGroup('general');

  let verificationMode = $generalSettings?.verificationMode ?? 'OnInput';

  function updateSettings(): void {
    const generalSettings = {
      verificationMode: verificationMode as VerificationMode
    };
    settings.save({ general: generalSettings });
  }
</script>

<Modal bind:isOpen let:close>
  <div class="grid grid-cols-1 w-full h-full p-2">
    <div class="px-2 flex flex-col justify-between">
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

  <Button variant="default" class="w-full" on:click={close}>Close</Button>
</Modal>
