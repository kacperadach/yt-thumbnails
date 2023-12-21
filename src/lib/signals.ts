import { signal, computed, effect } from "@preact/signals-react";
import {
  Image,
  Text,
  Circle,
  Arrow,
  Thumbnail,
  ThumbnailAsset,
  Video,
} from "./types";
import { fetchVideos, updateThumbnail } from "./api";

export const thumbnails = signal<Thumbnail[]>([]);
export const editingThumbnailId = signal<string | null>(null);
export const selectedAssetId = signal<string | null>(null);
export const selectedMenu = signal<"assets" | "background" | null>(null);
export const isCreatingAsset = signal<boolean>(false);
export const creatingAsset = signal<Image | Text | Circle | Arrow | null>(null);
export const videos = signal<Video[]>([]);
export const processingVideoId = signal<string | null>(null);

export const fetchedVideos = signal<boolean>(false);

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

effect(() => {
  if (thumbnail.value) {
    updateThumbnail(thumbnail.value);
  }
});

const timeoutSignal = signal<NodeJS.Timeout | null>(null);

effect(() => {
  if (fetchedVideos.value || selectedMenu.value !== "background") {
    return;
  }

  fetchedVideos.value = true;

  const getVideos = async (ids?: string[]) => {
    const response = await fetchVideos();
    if (response.success) {
      videos.value = [
        ...response.data,
        ...videos.value.filter(
          (v) => !response.data.find((v2: Video) => v.id === v2.id)
        ),
      ];
      if (timeoutSignal.value) {
        return;
      }
      const processingVideoIds = response.data
        .filter((v: Video) => !v.url)
        .map((v: Video) => v.id);
      if (processingVideoIds.length === 0) {
        console.log("no processing videos");
        return;
      }
      timeoutSignal.value = setTimeout(() => {
        getVideos(processingVideoIds);
      }, 2000);
    }
  };

  getVideos();
});

// effect(() => {
//   if (videos.value.length === 0) {
//     console.log("no videos or no poll");
//     return;
//   }

//   if (Date.now() - VIDEO_POLL_INTERVAL < lastVideoFetch.value) {
//     return;
//   }

//   const processingVideoIds = videos.value
//     .filter((v) => !v.url)
//     .map((v) => v.id);
//   if (processingVideoIds.length === 0) {
//     console.log("no processing videos");
//     return;
//   }

//   lastVideoFetch.value = Date.now();

//   const getVideos = async () => {
//     const response = await fetchVideos(processingVideoIds);
//     if (response.success) {
//       videos.value = [
//         ...response.data,
//         ...videos.value.filter(
//           (v) => !response.data.find((v2: Video) => v.id === v2.id)
//         ),
//       ];
//     }
//   };

//   getVideos();
// });
