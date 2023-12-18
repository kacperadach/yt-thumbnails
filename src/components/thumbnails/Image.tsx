import { Image } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";

interface ImageProps {
  image: Image;
}

export default function ImageComponent(props: ImageProps) {
  const { image } = props;

  const containerStyles = {
    ...getBaseCssProperties(image),
  };

  return (
    <div className="absolute" style={containerStyles}>
      <img src={image.src} className="w-full h-full object-contain" />
    </div>
  );
}
