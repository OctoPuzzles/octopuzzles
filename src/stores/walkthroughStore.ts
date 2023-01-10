import type { WalkthroughStep } from '$models/Walkthrough';
import deepCopy from '$utils/deepCopy';
import { get, writable } from 'svelte/store';
import { gameHistory } from './sudokuStore';

/**
 * Walkthroughs are gonna work like the gameHistory store,
 * except some of the steps are not there
 * and the steps have descriptions attached to them.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createWalkthroughStore() {
	// The timestamp is used for keyed lists in svelte
	const steps = writable<(WalkthroughStep & { timestamp: Date })[]>([]);
	const currentStepIndex = writable<number>(0);

	function set(newSteps: WalkthroughStep[]) {
		steps.set(newSteps.map((s) => ({ timestamp: new Date(), ...s })));

		currentStepIndex.set(0);
	}

	function removeStep(stepIndex: number): void {
		const currentSteps = deepCopy(get(steps));

		const newSteps = currentSteps.filter((_, i) => i !== stepIndex);

		steps.set(newSteps);

		currentStepIndex.set(Math.max(stepIndex - 1, 0));
	}

	function addStep(stepIndex = -1, replace = false): void {
		const currentSteps = deepCopy(get(steps));
		const values = deepCopy(get(gameHistory.getValue('values')));
		const cornermarks = deepCopy(get(gameHistory.getValue('cornermarks')));
		const centermarks = deepCopy(get(gameHistory.getValue('centermarks')));
		const notes = deepCopy(get(gameHistory.getValue('notes')));
		const colors = deepCopy(get(gameHistory.getValue('colors')));

		const newStep = {
			description: stepIndex >= 0 && replace ? currentSteps[stepIndex].description : '',
			step: {
				values,
				cornermarks,
				centermarks,
				notes,
				colors
			},
			timestamp: new Date()
		};

		if (stepIndex > -1) {
			currentSteps.splice(stepIndex, replace ? 1 : 0, newStep);
			steps.set(currentSteps);
		} else {
			steps.set([...currentSteps, newStep]);
		}

		currentStepIndex.set(stepIndex > -1 ? stepIndex : currentSteps.length);
	}

	function getCurrentStepNo() {
		return get(currentStepIndex);
	}

	return {
		subscribe: steps.subscribe,
		set,
		removeStep,
		addStep,
		getCurrentStepNo
	};
}

export const walkthroughStore = createWalkthroughStore();
