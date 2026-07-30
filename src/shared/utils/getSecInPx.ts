export default function getSecInPx({
  lengthInPx,
  dayCount,
}: {
  lengthInPx: number
  dayCount: number
}): number | null {
  if (!lengthInPx || dayCount === 0) return null
  const dSec = dayCount * 24 * 60 * 60
  return dSec / lengthInPx
}
