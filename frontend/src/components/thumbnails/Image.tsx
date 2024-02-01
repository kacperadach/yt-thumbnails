import { Image as ImageType } from "../../lib/types";
import { formatDropShadow, formatTextShadow } from "../../lib/utils";
import { Img, continueRender, delayRender } from "remotion";
import imglyRemoveBackground from "@imgly/background-removal";
import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Flex, Text } from "@radix-ui/themes";
import { aiImages, images } from "../../lib/signals";
import { DEFAULT_IMAGE_SRC } from "../../lib/constants";
import {
  generateFullLongShadow,
  generateImageLongShadow,
} from "../../lib/textShadow";

function getBase64FromImageUrl(url: string) {
  return new Promise((resolve, reject) => {
    // Create an image object
    const img = new Image();

    // Set up event handlers
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      // Get the data URL (Base64 representation of the image)
      const dataURL = canvas.toDataURL();

      // Resolve the promise with the Base64 string
      resolve(dataURL);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image at ${url}`));
    };

    // Set the image source to start loading
    img.crossOrigin = "Anonymous"; // This is important for loading cross-origin images
    img.src = url;
  });
}

interface ImageProps {
  image: ImageType;
  isRender: boolean;
}

export default function ImageComponent(props: ImageProps) {
  const { image, isRender } = props;

  const [imageBase64, setImageBase64] = useState<string>("");

  useEffect(() => {
    if (!image?.src || !isRender) {
      return;
    }

    console.log("IMAGE delay render");
    const render = delayRender();

    getBase64FromImageUrl(image.src)
      .then((base64) => setImageBase64(base64 as string))
      .catch((error) => console.error(error))
      .finally(() => continueRender(render));
  }, [image?.src]);

  if (!image) {
    return null;
  }

  if (!image.src && !image.transparent) {
    return null;
  }

  const imageRes = images.value.find((i) => i.id === image.imageId);
  const aiImageRes = aiImages.value.find((i) => i.id === image.imageId);

  // if (!imageRes?.url && !aiImageRes?.url && image.src !== DEFAULT_IMAGE_SRC) {
  //   return null;
  // }

  const src = image.src || imageRes?.url || aiImageRes?.url;

  let dropShadow = "";
  if (image.dropShadow && image.dropShadow.blur > 0) {
    dropShadow = `drop-shadow(${formatDropShadow(image.dropShadow)})`;
  }

  return (
    <>
      {src !== image.src && (
        <Flex
          justify="center"
          align="center"
          className="absolute w-full h-full"
        >
          <Spinner
            style={{ width: "3rem", height: "3rem", borderWidth: "0.5rem" }}
          />
        </Flex>
      )}
      {src && (
        // <Img
        //   draggable={false}
        //   src={src || ""}
        //   className={src !== image.src ? "bg-white opacity-75" : ""}
        //   style={{
        //     width: "100%",
        //     height: "100%",
        //     objectFit: "contain",
        //     // filter:
        //     //   image.dropShadow &&
        //     //   `drop-shadow(${formatDropShadow(image.dropShadow)}`,
        //     // filter: dropShadow,
        //   }}
        // />
        <svg
          width={`${image.width}px`}
          height={`${image.height}px`}
          overflow="visible"
          viewBox={`0 0 ${image.width} ${image.height}`}
          // style={{ zIndex: 0 }}
        >
          {image.imageOutline?.width > 0 && (
            <defs>
              <filter
                id={`outline-${image.id}`}
                filterUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={image.width}
                height={image.height}
              >
                <feMorphology
                  in="SourceAlpha"
                  operator="dilate"
                  radius={`${image.imageOutline?.width}`}
                  result="e1"
                />
                <feComposite
                  in="e1"
                  in2="SourceAlpha"
                  operator="out"
                  result="e2"
                />
                <feGaussianBlur
                  in="e1"
                  stdDeviation={image.imageOutline?.blur}
                  result="e2"
                />
                <feFlood floodColor={image.imageOutline?.color} result="e3" />
                <feComposite in="e3" in2="e2" operator="in" result="e4" />
                <feMerge>
                  <feMergeNode in="e4" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          )}
          <image
            xlinkHref={isRender ? imageBase64 : src}
            // xlinkHref={image.src}
            width={image.width}
            height={image.height}
            filter={`url(#outline-${image.id})`}
          />
        </svg>
      )}
    </>
  );
}
