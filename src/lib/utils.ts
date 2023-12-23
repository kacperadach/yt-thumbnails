import { CSSProperties } from "react";
import { EDITOR_WIDTH } from "./constants";
import { Border, DropShadow, ThumbnailAsset } from "./types";

export function remToPx(rem: number) {
  // Get the font-size of the root element (html)
  var rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return rem * rootFontSize;
}

// Function to convert Pixels to REM
export function pxToRem(px: number) {
  // Get the font-size of the root element (html)
  var rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return px / rootFontSize;
}

export function getPixelScaleFactor(width: number) {
  return width / EDITOR_WIDTH;
}

export function formatBorder(border: Border, pixelScaleFactor: number) {
  return `${border.width * pixelScaleFactor}px ${border.style} ${border.color}`;
}

export function formatDropShadow(dropShadow: DropShadow) {
  return `${dropShadow.x}px ${dropShadow.y}px ${dropShadow.blur}px ${dropShadow.color}`;
}

export function getBaseCssProperties(
  asset: ThumbnailAsset,
  pixelScaleFactor: number
) {
  let baseCssProperties: CSSProperties = {
    zIndex: asset.zIndex,
    width: `${asset.width}px`,
    aspectRatio: asset.aspectRatio,
    transform: `rotate(${
      asset.rotation || 0
    }deg) scale(${pixelScaleFactor}) translate(-50%, -50%)`,
  };

  baseCssProperties.top = `${asset.y}%`;
  baseCssProperties.left = `${asset.x}%`;
  baseCssProperties.transformOrigin = "top left";

  return baseCssProperties;
}

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function addSpaceBeforeCaps(str: string) {
  // Use a regular expression to add space before each capital letter
  // except for the first character.
  return str.replace(/(.)([A-Z])/g, "$1 $2");
}

export const downloadFile = (url: string, filename: string) => {
  const anchor = document.createElement("a");
  anchor.href = url.replaceAll("?", "%3F");
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
