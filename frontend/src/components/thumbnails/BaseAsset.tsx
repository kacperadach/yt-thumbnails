import { useState, useEffect, useRef } from "react";
import { Image, Shape, Text, ThumbnailAsset } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";
import {
  selectedAssetId,
  selectedMenu,
  thumbnail,
  thumbnails,
} from "../../lib/signals";
import TextAsset from "./Text";
import ImageComponent from "./Image";
import ShapeComponent from "./Shape";
import styles from "./baseAsset.module.css";
import Draggable from "./Draggable";

interface BaseAssetProps {
  asset: ThumbnailAsset;
  editable: boolean;
  pixelScaleFactor: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  marketing?: boolean;
}

export default function BaseAsset(props: BaseAssetProps) {
  const { asset, editable, pixelScaleFactor, containerRef, marketing } = props;

  // const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // const dragPositionRef = useRef<{
  //   x: number;
  //   y: number;
  // } | null>(null);

  // useEffect(() => {
  //   dragPositionRef.current = dragPosition;
  // }, [dragPosition]);

  // useEffect(() => {
  //   if (!containerRef?.current || !isDragging) {
  //     return;
  //   }

  //   const onMouseUp = () => {
  //     // if (selectedAssetId.value !== asset.id) {
  //     //   return;
  //     // }
  //     setIsDragging(false);
  //     thumbnails.value = thumbnails.value.map((t) => {
  //       if (t.id !== thumbnail.value?.id) {
  //         return t;
  //       }

  //       const newVal = {
  //         ...thumbnail.value,
  //         assets: thumbnail.value.assets.map((a) => {
  //           if (a.id === asset.id) {
  //             return {
  //               ...a,
  //               x: dragPositionRef.current?.x ?? a.x,
  //               y: dragPositionRef.current?.y ?? a.y,
  //             };
  //           }
  //           return a;
  //         }),
  //       };
  //       return newVal;
  //     });

  //     setDragPosition(null);
  //   };

  //   const onMouseMove = (e: any) => {
  //     const boundingBox =
  //       containerRef.current?.parentElement?.getBoundingClientRect();

  //     if (!boundingBox) {
  //       return;
  //     }

  //     const relativeX = (e.clientX - boundingBox.left) / boundingBox.width;
  //     const relativeY = (e.clientY - boundingBox.top) / boundingBox.height;

  //     setDragPosition({
  //       x: relativeX * 100,
  //       y: relativeY * 100,
  //     });
  //   };

  //   document.addEventListener("mousemove", onMouseMove);
  //   document.addEventListener("mouseup", onMouseUp);
  //   return () => {
  //     document.removeEventListener("mousemove", onMouseMove);
  //     document.removeEventListener("mouseup", onMouseUp);
  //   };
  // }, [isDragging]);

  let child;
  if (asset.type === "text") {
    child = <TextAsset text={asset as Text} />;
  } else if (asset.type === "image") {
    child = <ImageComponent src={(asset as Image).src} />;
  } else if (asset.type === "shape") {
    child = (
      <ShapeComponent shape={asset as Shape} containerRef={containerRef} />
    );
  }

  const isArrow =
    asset.type === "shape" && (asset as Shape).shapeType === "arrow";

  const assetWithDragPosition = {
    ...asset,
  };

  if (dragPosition) {
    assetWithDragPosition.x = dragPosition.x;
    assetWithDragPosition.y = dragPosition.y;
  }

  return (
    <div
      className={`cursor-pointer select-none ${
        marketing && "marketing-fade-in"
      } ${
        editable &&
        selectedAssetId.value !== asset.id &&
        !isArrow &&
        "hover:outline-dashed hover:outline-offset-2 hover:outline-white"
      }`}
      style={{
        ...getBaseCssProperties(assetWithDragPosition, pixelScaleFactor),
        position: "absolute",
      }}
      onClick={() => {
        if (!editable) {
          return;
        }
        selectedAssetId.value = asset.id;
        selectedMenu.value = null;
      }}
      // onMouseDown={() => {
      //   if (!editable || selectedAssetId.value !== asset.id) {
      //     return;
      //   }
      //   setIsDragging(true);
      // }}
    >
      <Draggable
        rotationAngle={0}
        dragEnabled={editable && selectedAssetId.value === asset.id && !isArrow}
        containerRef={containerRef}
        onPositionUpdate={(x: number, y: number) => setDragPosition({ x, y })}
        onDragFinish={(x: number, y: number) => {
          thumbnails.value = thumbnails.value.map((t) => {
            if (t.id !== thumbnail.value?.id) {
              return t;
            }

            const newVal = {
              ...thumbnail.value,
              assets: thumbnail.value.assets.map((a) => {
                if (a.id === asset.id) {
                  return {
                    ...a,
                    x: x,
                    y: y,
                  };
                }
                return a;
              }),
            };
            return newVal;
          });
          setDragPosition(null);
        }}
      >
        {selectedAssetId.value === asset.id && !isArrow && (
          <>
            <span
              className={`${styles.subtitleActiveBorder} ${styles.subtitleEditingLeft}`}
            />
            <span
              className={`${styles.subtitleActiveBorder} ${styles.subtitleEditingRight}`}
            />
            <span
              className={`${styles.subtitleActiveBorder} ${styles.subtitleEditingTop}`}
            />
            <span
              className={`${styles.subtitleActiveBorder} ${styles.subtitleEditingBottom}`}
            />
          </>
        )}
        {child}
      </Draggable>
    </div>
  );
}
