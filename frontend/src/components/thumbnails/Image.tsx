import { Image } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";
import { Img } from "remotion";

interface ImageProps {
  src: string | undefined;
}

export default function ImageComponent(props: ImageProps) {
  const { src } = props;

  if (!src) {
    return null;
  }

  return (
    <div>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
