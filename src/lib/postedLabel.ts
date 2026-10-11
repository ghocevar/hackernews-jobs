import { formatDistanceStrict } from 'date-fns';

const maxDateMs = 8.64e15;

export function postedLabel(
  unixSeconds: number,
  now = Date.now()
): string | null {
  if (!Number.isFinite(unixSeconds) || unixSeconds <= 0) {
    return null;
  }
  const ms = unixSeconds * 1000;
  if (!Number.isFinite(ms) || ms > maxDateMs) {
    return null;
  }
  const distance = formatDistanceStrict(new Date(ms), now, { addSuffix: true });
  return `Posted ${distance}`;
}
