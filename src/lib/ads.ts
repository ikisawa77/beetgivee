export type AdPlacement = "HOME_SLIDER" | "HOME_MID" | "HOME_BOTTOM" | "HOME_SIDEBAR";
export type Ad = { id: string; placement: AdPlacement; active: boolean; title?: string; imageUrl?: string; targetUrl?: string };

export function visibleAds<T extends { placement: AdPlacement; active: boolean }>(ads: T[], placement: AdPlacement) {
  return ads.filter((ad) => ad.active && ad.placement === placement);
}
