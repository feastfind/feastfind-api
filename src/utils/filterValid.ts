/**
 * Filters out entries in an object where the value is undefined, null, an empty string, or zero.
 * 
 * @example
 * filterValidValues({ foo: 'bar', baz: 0, qux: '' })
 * // => { foo: 'bar' }
 * 
 * @param obj - The object to filter.
 * @returns A new object with only entries that have valid values.
 */
export const filterValidValues = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== undefined && value !== '' && value !== null && value !== 0
    )
  );
};