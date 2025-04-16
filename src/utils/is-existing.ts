/**
 * Generic utility to filter out undefined content.
 *
 * ```typescript
 * const foos: Foo[] = bars.map(bar => findFooOrUndefined(bar.id)).filter(isDefined)
 * ```
 *
 * This avoids using explicit `as Foo` or non-null assertions.
 */
export function isDefined<T>(v: T | undefined): v is T {
	return typeof v !== 'undefined';
}

export function isExisting<T>(v: T | null | undefined): v is T {
	return isDefined(v) && v !== null;
}
