export function undefinedIfEmpty<T>(a: T[] | undefined): T[] | undefined {
	return a?.length === 0 ? undefined : a;
}
