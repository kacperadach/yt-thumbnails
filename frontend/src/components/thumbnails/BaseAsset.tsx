import { useState, useEffect, useRef, useCallback } from "react";
import { Image, Shape, Text, ThumbnailAsset } from "../../lib/types";
import { getBaseCssProperties, getFilterEffects } from "../../lib/utils";
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
import { Flex, IconButton } from "@radix-ui/themes";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import AssetContextMenu from "./AssetContextMenu";

export type DragCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface BaseAssetProps {
  asset: ThumbnailAsset;
  editable: boolean;
  pixelScaleFactor: number;
  containerRef?: React.RefObject<HTMLDivElement>;
  isRender: boolean;
}

export default function BaseAsset(props: BaseAssetProps) {
  const { asset, editable, pixelScaleFactor, containerRef, isRender } = props;

  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [dragDimensions, setDragDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [cornerDragging, setCornerDragging] = useState<DragCorner | null>(null);

  const assetContainerRef = useRef<HTMLDivElement>(null);

  const assetWithDragPosition = {
    ...asset,
  };

  if (dragPosition) {
    assetWithDragPosition.x = dragPosition.x;
    assetWithDragPosition.y = dragPosition.y;
  }

  if (dragDimensions !== null) {
    assetWithDragPosition.width = dragDimensions.width;
    assetWithDragPosition.height = dragDimensions.height;
  }

  let child;
  if (asset.type === "text") {
    child = <TextAsset text={assetWithDragPosition as Text}  />;
  } else if (asset.type === "image") {
    child = <ImageComponent image={assetWithDragPosition as Image} isRender={isRender} />;
  } else if (asset.type === "shape") {
    child = <ShapeComponent shape={assetWithDragPosition as Shape} />;
  }

  const isArrow =
    asset.type === "shape" && (asset as Shape).shapeType === "arrow";

  const updateAsset = (newValues: object) => {
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
              ...newValues,
            };
          }
          return a;
        }),
      };
      return newVal;
    });
  };

  const handleCornerMouseDown = (e: any, corner: DragCorner) => {
    e.stopPropagation();
    setCornerDragging(corner);
    setDragDimensions({
      width: asset.width,
      height: asset.height as number,
    });
  };

  const handleCornerDragMouseMove = useCallback(
    (e: any) => {
      if (
        !cornerDragging ||
        !containerRef?.current ||
        !assetContainerRef?.current
      ) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();

      const assetRect = assetContainerRef.current.getBoundingClientRect();

      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;

      const assetXCenter =
        assetRect.left - containerRect.left + assetRect.width / 2;

      const assetYCenter =
        assetRect.top - containerRect.top + assetRect.height / 2;

      let newWidth;
      let newHeight;

      switch (cornerDragging) {
        case "top-left":
          newHeight = (assetYCenter - relativeY) * 2;
          newWidth = (assetXCenter - relativeX) * 2;
          break;
        case "bottom-left":
          newHeight = (relativeY - assetYCenter) * 2;
          newWidth = (assetXCenter - relativeX) * 2;
          break;
        case "top-right":
          newHeight = (assetYCenter - relativeY) * 2;
          newWidth = (relativeX - assetXCenter) * 2;
          break;
        case "bottom-right":
          newWidth = (relativeX - assetXCenter) * 2;
          newHeight = (relativeY - assetYCenter) * 2;
          break;
        default:
          return;
      }

      newHeight = Math.max(newHeight, 0);
      newWidth = Math.max(newWidth, 0);

      setDragDimensions({
        width: newWidth * (1 / pixelScaleFactor),
        height: newHeight * (1 / pixelScaleFactor),
      });

      // setDragWidth(newWidth * (1 / pixelScaleFactor));
    },
    [cornerDragging]
  );

  const handleCornerDragMouseUp = useCallback(() => {
    setCornerDragging(null);

    updateAsset({
      width: dragDimensions?.width as number,
      height: dragDimensions?.height as number,
    });

    setDragDimensions(null);
  }, [dragDimensions]);

  useEffect(() => {
    if (dragDimensions === null) {
      return;
    }

    window.addEventListener("mousemove", handleCornerDragMouseMove);
    window.addEventListener("mouseup", handleCornerDragMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleCornerDragMouseMove);
      window.removeEventListener("mouseup", handleCornerDragMouseUp);
    };
  }, [dragDimensions, handleCornerDragMouseMove, handleCornerDragMouseUp]);

  const filterString = getFilterEffects(assetWithDragPosition);

  return (
    <div
      ref={assetContainerRef}
      className={`cursor-pointer select-none ${
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
    >
      {selectedAssetId.value === asset.id && !isArrow && (
        <Flex
          className="absolute z-100 left-1/2 -top-6"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <IconButton
            variant="solid"
            mx="1"
            onClick={() => {
              updateAsset({ rotation: (asset.rotation ?? 0) - 1 });
            }}
          >
            <FaArrowRotateLeft />
          </IconButton>
          <IconButton
            variant="solid"
            mx="1"
            onClick={() => {
              updateAsset({ rotation: (asset.rotation ?? 0) + 1 });
            }}
          >
            <FaArrowRotateRight />
          </IconButton>
        </Flex>
      )}

      {selectedAssetId.value === asset.id && !isArrow && (
        <>
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: "1rem",
              height: "1rem",
              top: 0,
              left: 0,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "nwse-resize",
              zIndex: 1000,
              outline: "1px solid black",
            }}
            onMouseDown={(e) => handleCornerMouseDown(e, "top-left")}
          />
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: "1rem",
              height: "1rem",
              top: 0,
              right: 0,
              borderRadius: "50%",
              transform: "translate(50%, -50%)",
              cursor: "nesw-resize",
              zIndex: 1000,
              outline: "1px solid black",
            }}
            onMouseDown={(e) => handleCornerMouseDown(e, "top-right")}
          />
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: "1rem",
              height: "1rem",
              bottom: 0,
              left: 0,
              borderRadius: "50%",
              transform: "translate(-50%, 50%)",
              cursor: "nesw-resize",
              zIndex: 1000,
              outline: "1px solid black",
            }}
            onMouseDown={(e) => handleCornerMouseDown(e, "bottom-left")}
          />
          <div
            style={{
              position: "absolute",
              backgroundColor: "white",
              width: "1rem",
              height: "1rem",
              bottom: 0,
              right: 0,
              borderRadius: "50%",
              transform: "translate(50%, 50%)",
              cursor: "nwse-resize",
              zIndex: 1000,
              outline: "1px solid black",
            }}
            onMouseDown={(e) => handleCornerMouseDown(e, "bottom-right")}
          />
        </>
      )}

      <Draggable
        relativeToClick={!isArrow}
        dragEnabled={editable && !isArrow}
        containerRef={containerRef}
        onPositionUpdate={(x: number, y: number) => setDragPosition({ x, y })}
        onDragFinish={(x: number, y: number) => {
          updateAsset({ x: x, y: y });
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

        <AssetContextMenu assetId={asset.id} enabled={editable}>
          <div style={{ filter: filterString }}>{child}</div>
        </AssetContextMenu>
      </Draggable>
    </div>
  );
}
