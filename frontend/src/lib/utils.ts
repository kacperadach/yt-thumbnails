import { CSSProperties } from "react";
import { EDITOR_WIDTH } from "./constants";
import {
  Arrow,
  Border,
  BoxShadow,
  DropShadow,
  Shape,
  TextShadow,
  Thumbnail,
  ThumbnailAsset,
  VideoResource,
} from "./types";
import tinycolor from "tinycolor2";

const DEFAULT_PRESET_COLORS = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
  "#FFFFFF",
];

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

export function formatBoxShadow(boxShadow: BoxShadow) {
  return `${boxShadow.x}px ${boxShadow.y}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color}`;
}

export function formatTextShadow(textShadow: TextShadow) {
  return `${textShadow.x || 0}px ${textShadow.y || 0}px ${
    textShadow.blur || 0
  }px ${textShadow.color || "black"}`;
}

export function getBaseCssProperties(
  asset: ThumbnailAsset,
  pixelScaleFactor: number
) {
  let rotation = asset.rotation || 0;
  let width = asset.width;
  let height = asset.height;
  if (asset.type === "shape" && (asset as Shape).shapeType === "arrow") {
    rotation = 0;
  }

  let baseCssProperties: CSSProperties = {
    zIndex: asset.zIndex,
    width: `${width}px`,
    aspectRatio: asset.aspectRatio,
    transform: `rotate(${rotation}deg) scale(${pixelScaleFactor}) translate(-50%, -50%)`,
    transformOrigin: "top left",
  };

  if (height) {
    baseCssProperties.height = `${height}px`;
  }

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

export function isVideoProcessing(video: VideoResource) {
  return (
    video.status === "pending" && Date.now() - video.created_at * 1000 < 3600000
  );
}

export function isVideoFailed(video: VideoResource) {
  return (
    video.status === "failed" ||
    (video.status === "pending" &&
      Date.now() - video.created_at * 1000 >= 3600000)
  );
}

export function getAllColorsFromThumbnail(thumbnail: Thumbnail) {
  let colorPresets = [];

  if (thumbnail) {
    if (thumbnail.background.color) {
      colorPresets.push(thumbnail.background.color);
    }

    thumbnail.assets.forEach((a) => {
      if (a.type === "text") {
        if (a.color) {
          colorPresets.push(a.color);
        }

        if (a.backgroundColor) {
          colorPresets.push(a.backgroundColor);
        }

        if (a.border?.color) {
          colorPresets.push(a.border.color);
        }

        if (a.borderTop?.color) {
          colorPresets.push(a.borderTop.color);
        }

        if (a.borderBottom?.color) {
          colorPresets.push(a.borderBottom.color);
        }

        if (a.borderLeft?.color) {
          colorPresets.push(a.borderLeft.color);
        }

        if (a.borderRight?.color) {
          colorPresets.push(a.borderRight.color);
        }
      } else if (a.type === "shape") {
        if (a.shapeType === "circle") {
          if (a.border?.color) {
            colorPresets.push(a.border.color);
          }

          if (a.outline?.color) {
            colorPresets.push(a.outline.color);
          }
        } else if (a.shapeType === "arrow") {
          if (a.dropShadow?.color) {
            colorPresets.push(a.dropShadow.color);
          }

          if (a.tailColor) {
            colorPresets.push(a.tailColor);
          }

          if (a.headColor) {
            colorPresets.push(a.headColor);
          }
        } else if (a.shapeType === "rectangle" || a.shapeType === "triangle") {
          if (a.backgroundColor) {
            colorPresets.push(a.backgroundColor);
          }

          if (a.border?.color) {
            colorPresets.push(a.border.color);
          }

          if (a.borderTop?.color) {
            colorPresets.push(a.borderTop.color);
          }

          if (a.borderBottom?.color) {
            colorPresets.push(a.borderBottom.color);
          }

          if (a.borderLeft?.color) {
            colorPresets.push(a.borderLeft.color);
          }

          if (a.borderRight?.color) {
            colorPresets.push(a.borderRight.color);
          }

          if (a.dropShadow?.color) {
            colorPresets.push(a.dropShadow.color);
          }
        }
      }
    });
  }

  colorPresets.push(...DEFAULT_PRESET_COLORS);

  console.log(colorPresets);

  colorPresets = [
    ...new Set(colorPresets.map((c) => tinycolor(c).toRgbString())),
  ];
  console.log(colorPresets);

  return colorPresets;
}

export function typeString(
  str: string,
  totalTime: number,
  setter: (str: string) => void
) {
  let length = str.length;
  let timeInterval = totalTime / length;

  for (let i = 0; i < length; i++) {
    setTimeout(() => {
      // Update the text with the current substring
      setter(str.substring(0, i + 1));
    }, timeInterval * i);
  }
}
