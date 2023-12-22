import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Thumbnail as RemotionThumbnail } from "@remotion/player";
import { AbsoluteFill } from "remotion";
import { Video } from "remotion";
import { Background, Thumbnail, ThumbnailAsset } from "../../lib/types";
import { getPixelScaleFactor } from "../../lib/utils";
import BaseAsset from "./BaseAsset";

const FPS = 30;
const MAX_ERROR_COUNT = 50;

function ThumbnailComposition(props: Record<string, unknown>) {
  const { thumbnail, width, editable, selectedAssetId } = props;

  const { background, assets } = thumbnail as Thumbnail;

  const pixelScaleFactor = getPixelScaleFactor(width as number);

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

  if (!thumbnail) {
    return null;
  }

  return (
    <AbsoluteFill
      className="relative overflow-visible border"
      style={{
        backgroundColor: background.color,
      }}
    >
      {background.type === "video" && videoSrc && (
        <div
          className="absolute w-full h-full"
          style={{
            backgroundColor: background.color,
            transform: `scale(${background.zoom || 1})  translate(-50%, -50%)`,
            top: `${background.y || 0}%`,
            left: `${background.x || 0}%`,
            transformOrigin: "top left",
          }}
        >
          <RemotionThumbnail
            component={videoComponent}
            compositionWidth={width as number}
            compositionHeight={(width as number) * (9 / 16)}
            frameToDisplay={FPS * (background.videoTime || 0)}
            durationInFrames={1000000}
            fps={FPS}
          />
        </div>
      )}

      {background.type === "image" && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url('${background.imageSrc}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundColor: background.color,
          }}
        />
      )}

      {background.type === "color" && (
        <div
          className="absolute w-full h-full"
          style={{
            backgroundColor: background.color,
          }}
        />
      )}

      <>
        {assets.map((asset, index) => {
          return (
            <BaseAsset
              key={index}
              asset={asset}
              editable={!!editable}
              pixelScaleFactor={pixelScaleFactor}
            />
          );
        })}
      </>
    </AbsoluteFill>
  );
}

interface ThumbnailPreviewProps {
  thumbnail: Thumbnail;
  editable?: boolean;
  width?: number;
  height?: number;
  selectedAssetId?: string;
}

export default function ThumbnailPreview(props: ThumbnailPreviewProps) {
  const { thumbnail, width, height, editable, selectedAssetId } = props;

  return (
    <RemotionThumbnail
      component={ThumbnailComposition}
      inputProps={{ thumbnail, width, editable, selectedAssetId }}
      compositionWidth={width || 1280}
      compositionHeight={height || 720}
      frameToDisplay={0}
      durationInFrames={0}
      fps={0}
    />
  );
}
