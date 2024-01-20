import { useRef } from "react";
import BaseAsset from "../../thumbnails/BaseAsset";
import { ThumbnailAsset } from "../../../lib/types";
import { getPixelScaleFactor } from "../../../lib/utils";

interface AssetPreviewProps {
  asset: ThumbnailAsset;
}

export default function AssetPreview(props: AssetPreviewProps) {
  const { asset } = props;
  const previewDivRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative"
      style={{
        height: "100%",
        width: "100%",
      }}
      ref={previewDivRef}
    >
      <BaseAsset
        asset={asset}
        editable={false}
        pixelScaleFactor={getPixelScaleFactor(
          previewDivRef.current?.clientWidth || 0
        )}
      />
    </div>
  );
}
