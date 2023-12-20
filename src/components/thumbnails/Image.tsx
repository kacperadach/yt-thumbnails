import { Image } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";

interface ImageProps {
  image: Image;
}

export default function ImageComponent(props: ImageProps) {
  const { image } = props;

  if (!image.src) {
    return null;
  }

  return (
    <div>
      <img src={image.src} className="w-full h-full object-contain" />
    </div>
  );
}
