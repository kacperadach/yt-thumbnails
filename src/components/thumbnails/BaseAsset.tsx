import React from "react";
import { Image, Shape, Text, ThumbnailAsset } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";
import { selectedAssetId, selectedMenu } from "../../lib/signals";
import TextAsset from "./Text";
import ImageComponent from "./Image";
import ShapeComponent from "./Shape";
import styles from "./baseAsset.module.css";

interface BaseAssetProps {
  asset: ThumbnailAsset;
  editable: boolean;
  pixelScaleFactor: number;
}

export default function BaseAsset(props: BaseAssetProps) {
  const { asset, editable, pixelScaleFactor } = props;

  let child;
  if (asset.type === "text") {
    child = <TextAsset text={asset as Text} />;
  } else if (asset.type === "image") {
    child = <ImageComponent src={(asset as Image).src} />;
  } else if (asset.type === "shape") {
    child = <ShapeComponent shape={asset as Shape} />;
  }

  return (
    <div
      className={`cursor-pointer ${
        editable &&
        selectedAssetId.value !== asset.id &&
        "hover:outline-dashed hover:outline-offset-2 hover:outline-white "
      }`}
      style={{
        ...getBaseCssProperties(asset, pixelScaleFactor),
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
      {selectedAssetId.value === asset.id && (
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
    </div>
  );
}
