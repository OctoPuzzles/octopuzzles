let id = 0;

export function useId(): number {
	return ++id;
}

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('two subsequent calls increases the output', () => {
		expect(useId()).toBeLessThan(useId());
	});
}
