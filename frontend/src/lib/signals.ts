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
  TemplateResource,
  AIImageResource,
} from "./types";
import {
  fetchAIImage,
  fetchAIImages,
  fetchImages,
  fetchVideos,
  updateThumbnail,
  uploadTransparentAIImage,
  uploadTransparentImage,
} from "./api";
import debounce from "lodash/debounce";
import { Session } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import imglyRemoveBackground from "@imgly/background-removal";

export type AlertMessage = {
  id: string;
  message: string;
  type: "success" | "error";
  createdAt: number;
  dismissed: boolean;
};

export const alerts = signal<AlertMessage[]>([]);

export const addErrorAlert = (message: string) => {
  alerts.value = [
    {
      id: uuidv4(),
      message,
      type: "error",
      createdAt: Date.now(),
      dismissed: false,
    },
    ...alerts.value,
  ];
};

export const addSuccessAlert = (message: string) => {
  alerts.value = [
    {
      id: uuidv4(),
      message,
      type: "success",
      createdAt: Date.now(),
      dismissed: false,
    },
    ...alerts.value,
  ];
};

export const thumbnails = signal<Thumbnail[]>([]);
export const editingThumbnailId = signal<string | null>(null);
export const selectedAssetId = signal<string | null>(null);
export const selectedMenu = signal<"assets" | "background" | null>("assets");
export const isCreatingAsset = signal<boolean>(false);
export const videos = signal<VideoResource[]>([]);
export const processingVideoId = signal<string | null>(null);
export const images = signal<ImageResource[]>([]);
export const isPollingVideos = signal<boolean>(false);
export const copiedAssetId = signal<string | null>(null);
export const loadedFonts = signal<string[]>([]);
export const userSession = signal<Session | null>(null);
export const homeLoading = signal<boolean>(false);
export const showSubscriptionDialog = signal<boolean>(false);
export const templates = signal<TemplateResource[]>([]);
export const aiImages = signal<AIImageResource[]>([]);

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

// effect(() => {
//   if (!thumbnail.value) {
//     return;
//   }

//   // find transparent images that dont have a valid transparent URL
//   const missingTransparentImageIds = thumbnail.value.assets
//     .filter(
//       (a) => a.type === "image" && (a as Image).transparent && !(a as Image).src
//     )
//     .map((i) => i as Image)
//     .filter((i) => !images.value.find((img) => img.id === i.imageId))
//     .map((i) => i.imageId)
//     .filter((i) => i);

//   if (missingTransparentImageIds.length === 0) {
//     return;
//   }

//   fetchImages(missingTransparentImageIds as string[]).then((response) => {
//     if (!response.success) {
//       return;
//     }

//     images.value = [
//       ...images.value,
//       ...response.data.map((image: ImageResource) => ({
//         ...image,
//         id: image.id,
//         src: image.url,
//       })),
//     ];
//   });
// });

const processingImagesIds = signal<string[]>([]);

const makeBackgroundTransparent = (
  allImages: Array<AIImageResource | ImageResource>,
  imageType: "upload" | "ai",
  uploadFunction: (id: string, file: File) => Promise<any>,
  updateFunction: (newImage: AIImageResource | ImageResource) => void
) => {
  if (!thumbnail.value) {
    return;
  }

  const transparentImagesWithMissingSrc = thumbnail.value.assets
    .filter(
      (a) =>
        a.type === "image" &&
        (a as Image).transparent &&
        !(a as Image).src &&
        (a as Image).imageType === imageType
    )
    .map((i) => i as Image)
    .map((i) => allImages.find((img) => img.id === i.imageId))
    .filter((i) => i)
    .filter((i) => !processingImagesIds.value.find((id) => i && i.id === id));

  if (transparentImagesWithMissingSrc.length === 0) {
    return;
  }

  processingImagesIds.value.push(
    ...transparentImagesWithMissingSrc.map(
      (i) => (i as ImageResource).id as string
    )
  );

  transparentImagesWithMissingSrc.forEach((image) => {
    if (!image) {
      return;
    }

    imglyRemoveBackground(image.url, { progress: (p) => console.log(p) })
      .then((blob: Blob) => {
        // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
        // const url = URL.createObjectURL(blob);

        const file = new File(
          [blob],
          `${image.id}.${
            image.url.split(".")[image.url.split(".").length - 1]
          }`,
          { type: blob.type }
        );

        uploadFunction(image.id, file).then((response) => {
          if (!response.success) {
            return;
          }

          // images.value = [
          //   ...images.value.filter((i) => i.id !== image.id),
          //   {
          //     ...response.data,
          //   },
          // ];

          updateFunction(response.data);

          thumbnails.value = thumbnails.value.map((t) => {
            if (t.id !== editingThumbnailId.value) {
              return t;
            }

            return {
              ...t,
              assets: t.assets.map((a) => {
                if (a.type !== "image") {
                  return a;
                }
                const img = a as Image;

                if (img.imageId !== image.id || !img.transparent) {
                  return a;
                }

                return {
                  ...img,
                  src: response.data.url_transparent,
                };
              }),
            };
          });
        });
      })
      .catch((error) => {
        console.log(error);
        processingImagesIds.value = processingImagesIds.value.filter(
          (id) => id !== image.id
        );
      });
  });
};

// remove background from transparent images that havent been processed yet
effect(() => {
  makeBackgroundTransparent(
    images.value,
    "upload",
    uploadTransparentImage,
    (newImage: AIImageResource | ImageResource) => {
      images.value = [
        ...images.value.filter((i) => i.id !== newImage.id),
        {
          ...newImage,
        },
      ];
    }
  );
});

// remove background from transparent AI images that havent been processed yet
effect(() => {
  makeBackgroundTransparent(
    aiImages.value,
    "ai",
    uploadTransparentAIImage,
    (newImage: AIImageResource | ImageResource) => {
      aiImages.value = [
        ...aiImages.value.filter((i) => i.id !== newImage.id),
        {
          ...(newImage as AIImageResource),
        },
      ];
    }
  );
});

// fetch regular images that are in the thumbnail
effect(() => {
  if (!thumbnail.value) {
    return;
  }

  const missingImageIds = thumbnail.value.assets
    .filter((a) => a.type === "image")
    .map((a) => a as Image)
    .filter((i) => i.imageType === "upload")
    .filter((i) => !images.value.find((img) => img.id === i.imageId))
    .map((i) => i.imageId)
    .filter((i) => i);

  if (
    thumbnail.value.background.imageId &&
    thumbnail.value.background.imageType === "upload" &&
    !images.value.find((img) => img.id === thumbnail.value?.background.imageId)
  ) {
    missingImageIds.push(thumbnail.value.background.imageId);
  }

  if (missingImageIds.length === 0) {
    return;
  }

  fetchImages(missingImageIds as string[]).then((response) => {
    if (!response.success) {
      return;
    }

    images.value = [
      ...images.value,
      ...response.data.map((image: ImageResource) => ({
        ...image,
        id: image.id,
        src: image.url,
      })),
    ];
  });
});

// fetch AI images that are in the thumbnail
effect(() => {
  if (!thumbnail.value) {
    return;
  }

  const missingImageIds = thumbnail.value.assets
    .filter((a) => a.type === "image")
    .map((a) => a as Image)
    .filter((i) => i.imageType === "ai")
    .filter((i) => !aiImages.value.find((img) => img.id === i.imageId))
    .map((i) => i.imageId)
    .filter((i) => i);

  if (
    thumbnail.value.background.imageId &&
    thumbnail.value.background.imageType === "ai" &&
    !aiImages.value.find(
      (img) => img.id === thumbnail.value?.background.imageId
    )
  ) {
    missingImageIds.push(thumbnail.value.background.imageId);
  }

  if (missingImageIds.length === 0) {
    return;
  }

  fetchAIImages(missingImageIds as string[]).then((response) => {
    if (!response.success) {
      return;
    }

    aiImages.value = [
      ...images.value,
      ...response.data.map((image: ImageResource) => ({
        ...image,
        id: image.id,
        src: image.url,
      })),
    ];
  });
});
