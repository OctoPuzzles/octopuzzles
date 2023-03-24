import { editorHistory } from '$lib/sudokuStore';

export function addLabel(labelName: string) {
  editorHistory.labels.update((currentLabels) => {
    return currentLabels.map((l) => {
      if (l.label.name === labelName) {
        l.selected = true;
      }
      return l;
    });
  });
}
