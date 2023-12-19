import React from "react";
import { ThumbnailAsset } from "../../lib/types";
import { getBaseCssProperties } from "../../lib/utils";
import { selectedAssetId } from "../../lib/signals";

interface BaseAssetProps {
  children: React.ReactNode;
  editable: boolean;
  thumbnailAsset: ThumbnailAsset;
}

export default function BaseAsset(props: BaseAssetProps) {
  const { children, editable, thumbnailAsset } = props;

  return (
    <div
      className={`absolute ${
        editable &&
        "hover:outline-dashed hover:outline-offset-2 hover:outline-gray-800 cursor-pointer"
      }`}
      style={{
        ...getBaseCssProperties(thumbnailAsset),
      }}
      onClick={() => {
        if (!editable) {
          return;
        }
        selectedAssetId.value = thumbnailAsset.id;
      }}
    >
      {children}
    </div>
  );
}
