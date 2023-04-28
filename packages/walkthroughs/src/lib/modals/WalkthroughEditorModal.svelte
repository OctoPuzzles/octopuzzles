<script lang="ts">
  import WalkthroughEditor from '$lib/WalkthroughEditor.svelte';
  import type { EditorHistoryStep, GameHistoryStep, WalkthroughStep } from '@octopuzzles/models';
  import { Modal } from '@octopuzzles/ui';

  export let isOpen: boolean;

  export let clues: EditorHistoryStep;
  export let gameData: GameHistoryStep;
  export let walkthrough: WalkthroughStep[];
  export let onClickStep: (step: GameHistoryStep) => void;
</script>

<Modal bind:isOpen>
  <WalkthroughEditor {clues} {gameData} {onClickStep} bind:walkthrough />
</Modal>
