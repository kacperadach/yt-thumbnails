import { useState, useEffect, useMemo } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import { remToPx } from "../lib/utils";

const TRANSPARENT_URL = "/images/marketing/man_transparent.png";

const REGULAR_URL = "/images/marketing/man.jpg";

interface ImageUploadProps {
  onFinish: (imageUrl: string) => void;
}

export default function ImageUpload(props: ImageUploadProps) {
  const { onFinish } = props;

  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsTransparent(true);
      onFinish(TRANSPARENT_URL);
    }, 2000);
  }, []);

  return (
    <div
      className={`flex justify-center items-center ${"scale-in"}`}
      style={{
        width: `100%`,
        position: "relative",
        minHeight: `${remToPx(10)}px`,
      }}
    >
      <div
        style={{ position: "absolute" }}
        className={`${isTransparent && "fade-out"}`}
      >
        <img src={REGULAR_URL} />
      </div>

      <img src={TRANSPARENT_URL} />
    </div>
  );
}
