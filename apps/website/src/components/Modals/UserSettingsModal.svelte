<script lang="ts">
  import { settings } from '$stores/settingsStore';
  import { Button, Label, Modal, RadioGroup } from '@octopuzzles/ui';

  export let isOpen: boolean;

  let verificationMode = $settings.verificationMode ?? 'ON_INPUT';

  function updateSettings(): void {
    settings.save({ verificationMode });
  }
</script>

<Modal bind:isOpen let:close>
  <div class="grid grid-cols-1 w-full h-full p-2">
    <div class="px-2 flex flex-col justify-between">
      <div>
        <Label id="highlightErrors">Highlight Error Cells</Label>
        <RadioGroup
          options={['ON_INPUT', 'ON_COMPLETE', 'ON_DEMAND']}
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
