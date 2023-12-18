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

export function getBaseCssProperties(asset: ThumbnailAsset) {
  return {
    left: `${asset.left}%`,
    right: `${asset.right}%`,
    top: `${asset.top}%`,
    bottom: `${asset.bottom}%`,
    zIndex: asset.zIndex,
    transform: `rotate(${asset.rotation || 0}deg)`,
    width: `${asset.width}%`,
  };
}
