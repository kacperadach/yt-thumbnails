import { Image } from "../../lib/types";
import { formatDropShadow, getBaseCssProperties } from "../../lib/utils";
import { Img } from "remotion";

interface ImageProps {
  image: Image;
}

export default function ImageComponent(props: ImageProps) {
  const { image } = props;

  if (!image || !image.src) {
    return null;
  }

  console.log(image);

  return (
    <div>
      <Img
        draggable={false}
        src={image.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter:
            image.dropShadow &&
            `drop-shadow(${formatDropShadow(image.dropShadow)}`,
        }}
      />
    </div>
  );
}
