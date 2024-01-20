import { Thumbnail as RemotionThumbnail } from "@remotion/player";
import { Video } from "remotion";
import { Background, Image, Thumbnail } from "../../lib/types";
import ImageComponent from "./Image";
import { useEffect, useState, useCallback } from "react";

const MAX_ERROR_COUNT = 50;
const FPS = 30;

interface BackgroundProps {
  marketing?: boolean;
  background: Background;
  width: number;
}

export default function BackgroundComponent(props: BackgroundProps) {
  const { marketing, background, width } = props;

  const [videoSrc, setVideoSrc] = useState(background.videoSrc || "");
  const [errorCount, setErrorCount] = useState(0);

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

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: background.color,
          backgroundImage: background.color,
        }}
      />
      {background.type === "video" && videoSrc && (
        <div
          className={`${marketing && "marketing-fade-in"}`}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: background.color,
            transform: `scale(${background.zoom || 1})  translate(-50%, -50%)`,
            top: `${background.y || 0}%`,
            left: `${background.x || 0}%`,
            transformOrigin: "top left",
            zIndex: 0,
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
            zIndex: 0,
            transform: `scale(${background.zoom || 1})  translate(-50%, -50%)`,
            top: `${background.y || 0}%`,
            left: `${background.x || 0}%`,
          }}
        >
          <ImageComponent image={{ src: background.src } as Image} />
        </div>
      )}
    </>
  );
}
