import { signal, computed } from "@preact/signals-react";
import { Thumbnail, ThumbnailAsset } from "./types";

export const thumbnail = signal<Thumbnail | null>(null);
export const selectedAssetId = signal<string | null>(null);
export const selectedAsset = computed<ThumbnailAsset | null>(() => {
  const asset = thumbnail.value?.assets.find(
    (asset) => asset.id === selectedAssetId.value
  ) as ThumbnailAsset;
  return asset ?? null;
});
