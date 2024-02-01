import { Thumbnail as RemotionThumbnail } from "@remotion/player";
import { Video } from "remotion";
import { Background, Image, Thumbnail } from "../../lib/types";
import ImageComponent from "./Image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getFilterEffects } from "../../lib/utils";
import { thumbnail } from "../../lib/signals";

const MAX_ERROR_COUNT = 50;
const FPS = 30;

interface BackgroundProps {
  background: Background;
  width: number;
  height: number;
  isRender: boolean;
}

export default function BackgroundComponent(props: BackgroundProps) {
  const { background, width, height, isRender } = props;

  const [videoSrc, setVideoSrc] = useState(background.videoSrc || "");
  const [errorCount, setErrorCount] = useState(0);

  const zIndex = useMemo(() => {
    const minZIndex = thumbnail.value?.assets.reduce((acc, asset) => {
      return Math.min(acc, asset.zIndex);
    }, 0);

    if (!minZIndex) {
      return 0;
    }

    return minZIndex - 1;
  }, [thumbnail.value]);

  useEffect(() => {
    setVideoSrc(background.videoSrc || "");
  }, [background]);

  const videoComponent = useCallback(
    () => (
      <Video
        src={videoSrc}
        width={width as number}
        height={(width as number) * (9 / 16)}
        onError={(e) => {
          setErrorCount((errorCount) => errorCount + 1);
          if (errorCount > MAX_ERROR_COUNT) {
            return;
          }
          setVideoSrc(background.videoSrc + "?time=" + Date.now());
        }}
      />
    ),
    [videoSrc, width, background.videoSrc]
  );

  const filterString = getFilterEffects(background);

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: background.color,
          backgroundImage: background.color,
          zIndex,
        }}
      />
      {background.type === "video" && videoSrc && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: background.color,
            transform: `scale(${background.zoom || 1})  translate(-50%, -50%)`,
            top: `${background.y || 0}%`,
            left: `${background.x || 0}%`,
            transformOrigin: "top left",
            zIndex,
            filter: filterString,
          }}
        >
          <RemotionThumbnail
            component={videoComponent}
            compositionWidth={Math.round(width as number)}
            compositionHeight={Math.round((width as number) * (9 / 16))}
            frameToDisplay={FPS * (background.videoTime || 0)}
            durationInFrames={1000000}
            fps={FPS}
          />
        </div>
      )}

      {background.type === "image" && (
        <div
          style={{
            position: "absolute",
            background: background.color,
            width: "100%",
            height: "100%",
            zIndex,
            transform: `translate(-50%, -50%) scale(${background.zoom || 1})`,
            top: `${background.y || 50}%`,
            left: `${background.x || 50}%`,
            transformOrigin: "50% 50%",
            filter: filterString,
          }}
        >
          <ImageComponent
            image={
              {
                src: background.src,
                transparent: background.transparent,
                width,
                height,
              } as Image
            }
            isRender={isRender}
          />
        </div>
      )}
    </>
  );
}
