import {
  DEFAULT_TEXT_OBJECT,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from "../lib/constants";
import { selectedAsset, thumbnail } from "../lib/signals";
import { ThumbnailAsset } from "../lib/types";
import EditMenuContainer from "./edit/EditMenuContainer";
import ThumbnailPreview from "./thumbnails/ThumbnailComposition";

export default function Editor() {
  if (!thumbnail.value) {
    return null;
  }

  return (
    <div className="flex">
      <ThumbnailPreview
        thumbnail={thumbnail.value}
        editable={true}
        width={EDITOR_WIDTH}
        height={EDITOR_HEIGHT}
      />
      {selectedAsset.value && <EditMenuContainer />}
    </div>
  );
}
