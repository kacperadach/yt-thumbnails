import { v4 as uuidv4 } from "uuid";
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { Thumbnail as RemotionThumbnail } from "@remotion/player";
import { AbsoluteFill } from "remotion";
import { Video } from "remotion";
import {
  Arrow,
  Background,
  Circle,
  Image,
  Rectangle,
  Thumbnail,
  ThumbnailAsset,
  Triangle,
} from "../../lib/types";
import { getPixelScaleFactor } from "../../lib/utils";
import BaseAsset from "./BaseAsset";
import ImageComponent from "./Image";
import {
  selectedAsset,
  thumbnails,
  selectedAssetId,
  copiedAssetId,
} from "../../lib/signals";

const FPS = 30;
const MAX_ERROR_COUNT = 50;

export function ThumbnailComposition(props: Record<string, unknown>) {
  const { thumbnail, width, editable, marketing = false } = props;

  const { background, assets } = thumbnail as Thumbnail;

  const pixelScaleFactor = getPixelScaleFactor(width as number);

  const [videoSrc, setVideoSrc] = useState(background.videoSrc || "");
  const [errorCount, setErrorCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!editable) {
      return;
    }
    const handleKeyPress = (event: any) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        // Control + C or Command + C
        copiedAssetId.value = selectedAsset.value?.id || null;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        // Control + V or Command + V
        if (!copiedAssetId.value) {
          return;
        }

        thumbnails.value = thumbnails.value.map((t) => {
          if (t.id !== (thumbnail as Thumbnail).id) {
            return t;
          }

          const copiedAsset = t.assets.find(
            (a) => a.id === copiedAssetId.value
          );

          const newAsset = {
            ...copiedAsset,
            id: uuidv4(),
            x: (copiedAsset?.x || 0) + 1,
            y: (copiedAsset?.y || 0) + 1,
          };

          copiedAssetId.value = newAsset.id;
          selectedAssetId.value = newAsset.id;

          return {
            ...t,
            assets: [...t.assets, newAsset],
          } as Thumbnail;
        });
      }

      if (event.key === "Delete") {
        // for Delete key
        if (!selectedAssetId.value) {
          return;
        }
        thumbnails.value = thumbnails.value.map((t) => {
          if (t.id !== (thumbnail as Thumbnail).id) {
            return t;
          }

          return {
            ...t,
            assets: t.assets.filter((a) => {
              return a.id !== selectedAssetId.value;
            }),
          };
        });
      }

      if (event.key === "Escape") {
        // for the Escape key
        selectedAssetId.value = null;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        if (!selectedAssetId.value) {
          return;
        }
        let xDiff = 0;
        let yDiff = 0;
        if (event.key === "ArrowUp") {
          yDiff = -1;
        } else if (event.key === "ArrowDown") {
          yDiff = 1;
        } else if (event.key === "ArrowLeft") {
          xDiff = -1;
        } else if (event.key === "ArrowRight") {
          xDiff = 1;
        }

        thumbnails.value = thumbnails.value.map((t) => {
          if (t.id !== (thumbnail as Thumbnail).id) {
            return t;
          }

          return {
            ...t,
            assets: t.assets.map((a) => {
              if (a.id !== selectedAssetId.value) {
                return a;
              }

              return {
                ...a,
                y: (a.y || 0) + yDiff,
                x: (a.x || 0) + xDiff,
              };
            }),
          };
        });
      }
    };

    const handleWheel = (event: any) => {
      // console.log(`Mouse wheel event: deltaY = ${event.deltaY}`);
      // // Add your logic here for the mouse wheel event
      // // event.deltaY gives the amount of scroll
      // // Positive values indicate a scroll down, negative values scroll up
      // if (!selectedAssetId.value) {
      //   return;
      // }
      // event.stopPropagation();
      // const delta = event.deltaY;
      // thumbnails.value = thumbnails.value.map((t) => {
      //   if (t.id !== (thumbnail as Thumbnail).id) {
      //     return t;
      //   }
      //   return {
      //     ...t,
      //     assets: t.assets.map((a) => {
      //       if (a.id !== selectedAssetId.value) {
      //         return a;
      //       }
      //       return {
      //         ...a,
      //         rotation: (a.rotation || 0) + delta / 20,
      //       };
      //     }),
      //   };
      // });
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("wheel", handleWheel);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.addEventListener("wheel", handleWheel);
    };
  }, [editable]);

  if (!thumbnail) {
    return null;
  }

  return (
    <AbsoluteFill
      className="overflow-visible border"
      style={{
        backgroundColor: background.color,
        position: "relative",
      }}
      ref={containerRef}
    >
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
          <ImageComponent src={background.imageSrc} />
        </div>
      )}

      {background.type === "color" && (
        <div
          style={{
            background: background.color,
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
      )}

      <>
        {assets.map((asset, index) => {
          return (
            <BaseAsset
              key={asset.id}
              asset={asset}
              editable={!!editable}
              pixelScaleFactor={pixelScaleFactor}
              containerRef={containerRef}
              marketing={marketing as boolean}
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
  marketing?: boolean;
}

export default function ThumbnailPreview(props: ThumbnailPreviewProps) {
  const { thumbnail, width, height, editable, marketing } = props;

  return (
    <RemotionThumbnail
      component={ThumbnailComposition}
      inputProps={{ thumbnail, width, height, editable, marketing }}
      compositionWidth={Math.round(width || 1280)}
      compositionHeight={Math.round(height || 720)}
      frameToDisplay={0}
      durationInFrames={1}
      fps={30}
    />
  );
}
