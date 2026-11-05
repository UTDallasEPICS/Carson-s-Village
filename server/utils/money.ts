/** Convert a dollar amount (number or formatted string) to integer cents. Empty/invalid → 0. */
export function dollarsToCents(value: unknown): number {
  if (value == null || value === '') {
    return 0
  }
  const parsed = typeof value === 'number'
    ? value
    : parseFloat(String(value).replace(/,/g, ''))
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }
  return Math.trunc(parsed * 100)
}
