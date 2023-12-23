import { Still, getInputProps } from "remotion";
import { Thumbnail } from "../lib/types";
import { ThumbnailComposition } from "../components/thumbnails/ThumbnailComposition";
import { EDITOR_HEIGHT, EDITOR_WIDTH } from "../lib/constants";

const COMPOSITION_ID = "ThumbnailComposition";

interface ThumbnailRenderProps {
  thumbnail: Thumbnail;
}

export default function ThumbnailRender() {
  const { thumbnail } = getInputProps() as unknown as ThumbnailRenderProps;

  return (
    <Still
      id={COMPOSITION_ID}
      component={() => (
        <ThumbnailComposition
          thumbnail={thumbnail}
          width={EDITOR_WIDTH}
          editable={false}
        />
      )}
      width={EDITOR_WIDTH}
      height={EDITOR_HEIGHT}
    />
  );
}
