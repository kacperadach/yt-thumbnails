import { signal, computed, effect } from "@preact/signals-react";
import { Image, Text, Circle, Arrow, Thumbnail, ThumbnailAsset } from "./types";

export const thumbnail = signal<Thumbnail | null>(null);
export const selectedAssetId = signal<string | null>(null);
export const selectedMenu = signal<"assets" | "background" | null>(null);
export const isCreatingAsset = signal<boolean>(false);
export const creatingAsset = signal<Image | Text | Circle | Arrow | null>(null);

export const selectedAsset = computed<ThumbnailAsset | null>(() => {
  const asset = thumbnail.value?.assets.find(
    (asset) => asset.id === selectedAssetId.value
  ) as ThumbnailAsset;
  return asset ?? null;
});

export const thumbnailWithCreatingAsset = computed<Thumbnail | null>(() => {
  if (!thumbnail.value) {
    return null;
  }

  if (!creatingAsset.value) {
    return thumbnail.value;
  }

  return {
    ...thumbnail.value,
    assets: [...thumbnail.value.assets, creatingAsset.value],
  };
});

effect(() => {
  if (selectedAsset.value || selectedMenu.value) {
    creatingAsset.value = null;
    isCreatingAsset.value = false;
  }
});
