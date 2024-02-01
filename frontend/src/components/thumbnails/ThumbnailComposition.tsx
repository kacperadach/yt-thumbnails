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
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { Video } from "remotion";
import {
  Arrow,
  Background,
  Circle,
  Image,
  Rectangle,
  Text,
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
  loadedFonts,
} from "../../lib/signals";
import { useSignalEffect } from "@preact/signals-react";
import {
  AVAILABLE_DEFAULT_FONTS,
  getAllGoogleFonts,
  loadGoogleFont,
} from "../../lib/fonts";
import BackgroundComponent from "./Background";
import AssetContextMenu from "./AssetContextMenu";
import Swal from "sweetalert2";

export function ThumbnailComposition(props: Record<string, unknown>) {
  const { thumbnail, width, height, editable, isRender } = props;

  const { background, assets } = thumbnail as Thumbnail;

  const pixelScaleFactor = getPixelScaleFactor(width as number);


  const containerRef = useRef<HTMLDivElement>(null);

  useSignalEffect(() => {
    const loadFonts = async () => {
      const unloadedGoogleFonts = assets
        .filter((a) => a.type === "text")
        .map((a) => (a as Text).fontFamily)
        .filter(
          (f) =>
            f &&
            !AVAILABLE_DEFAULT_FONTS.includes(f) &&
            !loadedFonts.value.includes(f)
        ) as string[];

      if (unloadedGoogleFonts.length === 0) {
        return;
      }

      const render = delayRender();

      loadedFonts.value = [...loadedFonts.value, ...unloadedGoogleFonts];

      const googleFonts = await getAllGoogleFonts();

      const promises = unloadedGoogleFonts.map((font) => {
        const fontOption = googleFonts.find((f) => f.fontFamily === font);
        if (!fontOption) {
          return Promise.resolve();
        }
        return loadGoogleFont({
          name: font,
          fontFamily: fontOption.fontFamily,
          import: fontOption.load,
          type: "google",
        });
      });

      Promise.all(promises).then(() => {
        continueRender(render);
      });
    };
    loadFonts();
  });

  useEffect(() => {
    if (!editable) {
      return;
    }
    const handleKeyPress = (event: any) => {
      // if ((event.ctrlKey || event.metaKey) && event.key === "c") {
      //   // Control + C or Command + C
      //   copiedAssetId.value = selectedAsset.value?.id || null;
      // }
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        // Control + V or Command + V
        // if (!copiedAssetId.value) {
        //   return;
        // }

        if (!selectedAssetId.value) {
          return;
        }
        event.stopPropagation();

        thumbnails.value = thumbnails.value.map((t) => {
          if (t.id !== (thumbnail as Thumbnail).id) {
            return t;
          }

          const copiedAsset = t.assets.find(
            (a) => a.id === selectedAssetId.value
          );

          const newAsset = {
            ...selectedAsset.value,
            id: uuidv4(),
            x: (copiedAsset?.x || 0) + 1,
            y: (copiedAsset?.y || 0) + 1,
          };

          selectedAssetId.value = newAsset.id;

          return {
            ...t,
            assets: [...t.assets, newAsset],
          } as Thumbnail;
        });
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        // for Delete key
        if (!selectedAssetId.value) {
          return;
        }

        if (document.activeElement?.tagName === "INPUT") {
          // If it's an input, do nothing
          return;
        }

        Swal.fire({
          title: "Warning!",
          text: "Are you sure you want to delete this asset?",
          icon: "warning",
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          showCancelButton: true,
          confirmButtonColor: "#08d087",
        }).then((result) => {
          if (result.isConfirmed) {
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
      className="outline-black"
      style={{
        position: "relative",
      }}
      ref={containerRef}
    >
      <BackgroundComponent
        background={background as Background}
        width={width as number}
        height={height as number}
        isRender={isRender as boolean}
      />
      <>
        {assets.map((asset) => {
          return (
            <BaseAsset
              key={asset.id}
              asset={asset}
              editable={!!editable}
              pixelScaleFactor={pixelScaleFactor}
              containerRef={containerRef}
              isRender={isRender as boolean}
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
  const { thumbnail, width, height, editable } = props;

  return (
    <RemotionThumbnail
      component={ThumbnailComposition}
      inputProps={{ thumbnail, width, height, editable }}
      compositionWidth={Math.round(width || 1280)}
      compositionHeight={Math.round(height || 720)}
      frameToDisplay={0}
      durationInFrames={1}
      fps={30}
    />
  );
}
