export function visiblePicks<T>(publishedPicks: T[], hasEntitlement: boolean) {
  return hasEntitlement ? publishedPicks : publishedPicks.slice(0, 2);
}
