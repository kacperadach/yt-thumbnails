import { signal, computed, effect } from "@preact/signals-react";
import {
  Image,
  Text,
  Circle,
  Arrow,
  Thumbnail,
  ThumbnailAsset,
  VideoResource,
  ImageResource,
} from "./types";
import { fetchVideos, updateThumbnail } from "./api";
import debounce from "lodash/debounce";
import { Session } from "@supabase/supabase-js";

export const thumbnails = signal<Thumbnail[]>([]);
export const editingThumbnailId = signal<string | null>(null);
export const selectedAssetId = signal<string | null>(null);
export const selectedMenu = signal<"assets" | "background" | null>(null);
export const isCreatingAsset = signal<boolean>(false);
export const videos = signal<VideoResource[]>([]);
export const processingVideoId = signal<string | null>(null);
export const images = signal<ImageResource[]>([]);
export const isPollingVideos = signal<boolean>(false);
export const isPollingImages = signal<boolean>(false);
export const copiedAssetId = signal<string | null>(null);
export const loadedFonts = signal<string[]>([]);
export const userSession = signal<Session | null>(null);

export const thumbnail = computed<Thumbnail | null>(() => {
  const thumbnail = thumbnails.value.find(
    (thumbnail) => thumbnail.id === editingThumbnailId.value
  );
  return thumbnail ?? null;
});

export const selectedAsset = computed<ThumbnailAsset | null>(() => {
  const asset = thumbnail.value?.assets.find(
    (asset) => asset.id === selectedAssetId.value
  ) as ThumbnailAsset;
  return asset ?? null;
});

effect(() => {
  if (selectedAsset.value || selectedMenu.value) {
    isCreatingAsset.value = false;
  }
});

const debouncedUpdateThumbnail = debounce(updateThumbnail, 500);

effect(() => {
  if (thumbnail.value) {
    debouncedUpdateThumbnail(thumbnail.value);
  }
});
