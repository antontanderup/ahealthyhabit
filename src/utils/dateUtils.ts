/** Returns YYYY-MM-DD in the device's local timezone. */
export function toLocalISODate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Parses a YYYY-MM-DD string as local-timezone midnight.
 * Falls back to Date.parse() for legacy "Sat Apr 03 2021" strings —
 * Date.parse() is UTC-based and may be one day off in non-UTC timezones.
 */
export function parseLocalDate(dateStr: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  return Date.parse(dateStr);
}
