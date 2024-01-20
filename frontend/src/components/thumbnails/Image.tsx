import { Image } from "../../lib/types";
import { formatDropShadow } from "../../lib/utils";
import { Img } from "remotion";
import imglyRemoveBackground from "@imgly/background-removal";
import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Flex, Text } from "@radix-ui/themes";
import { aiImages, images } from "../../lib/signals";
import { DEFAULT_IMAGE_SRC } from "../../lib/constants";

interface ImageProps {
  image: Image;
}

export default function ImageComponent(props: ImageProps) {
  const { image } = props;

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

  console.log(src);

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
        <Img
          draggable={false}
          src={src || ""}
          className={src !== image.src ? "bg-white opacity-75" : ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter:
              image.dropShadow &&
              `drop-shadow(${formatDropShadow(image.dropShadow)}`,
          }}
        />
      )}
    </>
  );
}
