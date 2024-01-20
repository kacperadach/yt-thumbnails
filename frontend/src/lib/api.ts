import { v4 as uuidv4 } from "uuid";
import { Thumbnail, ThumbnailAsset } from "./types";
import { signal } from "@preact/signals-react";
import {
  addErrorAlert,
  alerts,
  showSubscriptionDialog,
  userSession,
} from "./signals";

const apiUrl = process.env.REACT_APP_API_URL;

const THUMBNAIL_PATH = "/v1/thumbnail";
const IMAGE_PATH = "/v1/image";
const VIDEO_PATH = "/v1/video";
const RENDER_PATH = "/v1/render";
const PAYMENT_PATH = "/v1/payment";
const TEMPLATE_PATH = "/v1/template";
const AI_IMAGE_PATH = "/v1/ai-image";

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
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 403 && data.detail === "Limit exceeded") {
      showSubscriptionDialog.value = true;
    } else {
      addErrorAlert(data?.detail);
    }
    return {
      success: false,
      error: response.statusText,
    };
  }

  return {
    success: true,
    data,
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
  thumbnail: Thumbnail,
  templateId?: string
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
      templateId,
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

export async function processVideo(url: string) {
  return await makeRequest(
    `${apiUrl}${VIDEO_PATH}`,
    "POST",
    JSON.stringify({
      url,
    })
  );
}

export async function fetchVideos(ids?: string[]) {
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

export async function uploadTransparentImage(imageId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await makeRequest(
    `${apiUrl}${IMAGE_PATH}/${imageId}/transparent`,
    "PUT",
    formData,
    {}
  );
}

export async function uploadTransparentAIImage(imageId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await makeRequest(
    `${apiUrl}${AI_IMAGE_PATH}/${imageId}/transparent`,
    "PUT",
    formData,
    {}
  );
}

export async function fetchImages(imageIds?: string[]) {
  let url = `${apiUrl}${IMAGE_PATH}`;
  if (imageIds) {
    url += "?";
    url += imageIds.map((id) => `image_id=${id}`).join("&");
  }

  return await makeRequest(url);
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

export async function createCustomerPortalSession() {
  return await makeRequest(
    `${apiUrl}${PAYMENT_PATH}/create-customer-portal-session`,
    "POST"
  );
}

export async function saveTemplate(name: string, template: Thumbnail) {
  return await makeRequest(
    `${apiUrl}${TEMPLATE_PATH}`,
    "POST",
    JSON.stringify({
      name,
      template,
    })
  );
}

export async function fetchTemplates() {
  return await makeRequest(`${apiUrl}${TEMPLATE_PATH}`);
}

///v1/ai-image/generate/background

export async function generateImage(
  prompt: string,
  negativePrompt: string,
  width: number,
  height: number
) {
  return await makeRequest(
    `${apiUrl}${AI_IMAGE_PATH}/generate`,
    "POST",
    JSON.stringify({
      prompt,
      negative_prompt: negativePrompt,
      width,
      height,
    })
  );
}

export async function fetchAIImage(imageId: string) {
  return await makeRequest(`${apiUrl}${AI_IMAGE_PATH}/${imageId}`);
}

export async function fetchAIImages(imageIds?: string[]) {
  let url = `${apiUrl}${AI_IMAGE_PATH}`;
  if (imageIds) {
    url += "?";
    url += imageIds.map((id) => `image_id=${id}`).join("&");
  }

  return await makeRequest(url);
}
