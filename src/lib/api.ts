import { v4 as uuidv4 } from "uuid";
import { Thumbnail, ThumbnailAsset } from "./types";
import { signal } from "@preact/signals-react";

export const apiError = signal<string | null>(null);

const apiUrl = process.env.REACT_APP_API_URL;

const USER_ID = "user_id";

const THUMBNAIL_PATH = "/v1/thumbnail";
const IMAGE_PATH = "/v1/image";
const VIDEO_PATH = "/v1/video";

export const getOrSetUserId = () => {
  let userId = localStorage.getItem(USER_ID);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID, userId);
  }
  return userId;
};

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
  const response = await fetch(url, {
    method,
    headers:
      headers !== undefined
        ? headers
        : {
            "Content-Type": "application/json",
          },
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
  const userId = getOrSetUserId();
  const apiResponse = await makeRequest(
    `${apiUrl}${THUMBNAIL_PATH}/by-user/${userId}`
  );

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

  const userId = getOrSetUserId();
  const apiResponse = await makeRequest(
    `${apiUrl}${THUMBNAIL_PATH}`,
    "POST",
    JSON.stringify({
      user_id: userId,
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

  const userId = getOrSetUserId();
  const apiResponse = await makeRequest(
    `${apiUrl}${THUMBNAIL_PATH}/${thumbnail.id}`,
    "PUT",
    JSON.stringify({
      user_id: userId,
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
  const userId = getOrSetUserId();

  return await makeRequest(
    `${apiUrl}${VIDEO_PATH}`,
    "POST",
    JSON.stringify({
      user_id: userId,
      url,
    })
  );
}

export async function fetchVideos(ids?: string[]): Promise<ApiResponse> {
  const userId = getOrSetUserId();
  let url = `${apiUrl}${VIDEO_PATH}/by-user/${userId}`;
  if (ids) {
    url += "?";
    url += ids.map((id) => `video_id=${id}`).join("&");
  }

  return await makeRequest(url);
}

export async function uploadImage(selectedFile: File) {
  const userId = getOrSetUserId();
  const formData = new FormData();
  formData.append("file", selectedFile);
  return await makeRequest(
    `${apiUrl}${IMAGE_PATH}?user_id=${userId}`,
    "POST",
    formData,
    {}
  );
}

export async function fetchImages() {
  const userId = getOrSetUserId();
  return await makeRequest(`${apiUrl}${IMAGE_PATH}/by-user/${userId}`);
}
