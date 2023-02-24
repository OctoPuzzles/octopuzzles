import type { Walkthrough } from '$models/Walkthrough';
import { walkthroughStore } from '$stores/walkthroughStore';
import { get } from 'svelte/store';

export function fillWalkthroughStore(walkthrough: Walkthrough | null): void {
  if (walkthrough?.steps && get(walkthroughStore).length === 0) {
    walkthroughStore.set(walkthrough?.steps);
  }
}
