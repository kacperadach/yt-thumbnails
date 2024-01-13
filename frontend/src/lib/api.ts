import { v4 as uuidv4 } from "uuid";
import { Thumbnail, ThumbnailAsset } from "./types";
import { signal } from "@preact/signals-react";
import { userSession } from "./signals";

export const apiError = signal<string | null>(null);

const apiUrl = process.env.REACT_APP_API_URL;

const THUMBNAIL_PATH = "/v1/thumbnail";
const IMAGE_PATH = "/v1/image";
const VIDEO_PATH = "/v1/video";
const RENDER_PATH = "/v1/render";
const PAYMENT_PATH = "/v1/payment";

export type ApiResponse = Promise<{
  success: boolean;
  data?: any;
  error?: string;
}>;

async function makeRequest(
  url: string,
  method: string = "GET",
  body?: any,
  headers?: any
): Promise<ApiResponse> {
  const allHeaders =
    headers !== undefined
      ? headers
      : {
          "Content-Type": "application/json",
        };
  if (userSession.value) {
    allHeaders["Authorization"] = `Bearer ${userSession.value.access_token}`;
  }

  let response = await fetch(url, {
    method,
    headers: allHeaders,
    body,
  });
  if (!response.ok) {
    apiError.value = response.statusText;
    return {
      success: false,
      error: response.statusText,
    };
  }

  return {
    success: true,
    data: await response.json(),
  };
}

type ThumbnailResource = {
  id: string;
  thumbnail: Thumbnail;
};

export async function fetchThumbnails(): Promise<ApiResponse> {
  const apiResponse = await makeRequest(`${apiUrl}${THUMBNAIL_PATH}`);

  if (!apiResponse.success) {
    return apiResponse;
  }

  return {
    ...apiResponse,
    data: apiResponse.data.map((thumbnailResource: ThumbnailResource) => {
      return { ...thumbnailResource.thumbnail, id: thumbnailResource.id };
    }),
  };
}

export async function createThumbnail(
  thumbnail: Thumbnail
): Promise<ApiResponse> {
  const thumbnailCopy = {
    ...thumbnail,
    id: undefined,
  };

  const apiResponse = await makeRequest(
    `${apiUrl}${THUMBNAIL_PATH}`,
    "POST",
    JSON.stringify({
      thumbnail: thumbnailCopy,
    })
  );

  if (!apiResponse.success) {
    return apiResponse;
  }

  return {
    ...apiResponse,
    data: { ...apiResponse.data.thumbnail, id: apiResponse.data.id },
  };
}

export async function updateThumbnail(
  thumbnail: Thumbnail
): Promise<ApiResponse> {
  const thumbnailCopy = {
    ...thumbnail,
    id: undefined,
  };

  const apiResponse = await makeRequest(
    `${apiUrl}${THUMBNAIL_PATH}/${thumbnail.id}`,
    "PUT",
    JSON.stringify({
      thumbnail: thumbnailCopy,
    })
  );

  if (!apiResponse.success) {
    return apiResponse;
  }

  return {
    ...apiResponse,
    data: { ...apiResponse.data.thumbnail, id: apiResponse.data.id },
  };
}

export async function processVideo(url: string): Promise<ApiResponse> {
  return await makeRequest(
    `${apiUrl}${VIDEO_PATH}`,
    "POST",
    JSON.stringify({
      url,
    })
  );
}

export async function fetchVideos(ids?: string[]): Promise<ApiResponse> {
  let url = `${apiUrl}${VIDEO_PATH}`;
  if (ids) {
    url += "?";
    url += ids.map((id) => `video_id=${id}`).join("&");
  }

  return await makeRequest(url);
}

export async function uploadImage(selectedFile: File) {
  const formData = new FormData();
  formData.append("file", selectedFile);
  return await makeRequest(`${apiUrl}${IMAGE_PATH}`, "POST", formData, {});
}

export async function fetchImages() {
  return await makeRequest(`${apiUrl}${IMAGE_PATH}`);
}

export async function initiateRender(thumbnailId: string) {
  return await makeRequest(
    `${apiUrl}${RENDER_PATH}/initiate`,
    "POST",
    JSON.stringify({
      thumbnail_id: thumbnailId,
    })
  );
}

export async function fetchRender(renderId: string) {
  return await makeRequest(`${apiUrl}${RENDER_PATH}/${renderId}`);
}

export async function createCheckoutSession(priceId: string) {
  return await makeRequest(
    `${apiUrl}${PAYMENT_PATH}/create-checkout-session/${priceId}`,
    "POST"
  );
}
