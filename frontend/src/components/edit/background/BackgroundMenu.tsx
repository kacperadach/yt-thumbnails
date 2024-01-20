import {
  thumbnail,
  thumbnails,
  editingThumbnailId,
} from "../../../lib/signals";
import { IoColorPaletteSharp } from "react-icons/io5";
import { RiVideoAddFill } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import EditField from "../EditField";
import { Container } from "react-bootstrap";
import LabelAndField from "../LabelAndField";
import { Flex } from "@radix-ui/themes";
import ImageMenu from "../image/ImageMenu";
import VideoMenu from "../video/VideoMenu";

export default function BackgroundMenu() {
  const onUpdate = (newFields: Object) => {
    if (!thumbnail.value || !editingThumbnailId.value) {
      return;
    }

    thumbnails.value = thumbnails.value.map((t) => {
      if (t.id === editingThumbnailId.value) {
        return {
          ...t,
          background: {
            ...t.background,
            ...newFields,
          },
        };
      }
      return t;
    });
  };

  return (
    <div>
      <Flex justify="center">
        <h4 className="text-4xl font-bold my-1">Editing Background</h4>
      </Flex>
      <div>
        <div className="flex justify-center w-full cursor-pointer my-2">
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "color" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "color" })}
          >
            <IoColorPaletteSharp size="2rem" />
          </div>
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "image" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "image" })}
          >
            <BsCardImage size="2rem" />
          </div>
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "video" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "video" })}
          >
            <RiVideoAddFill size="2rem" />
          </div>
        </div>
        <Container>
          {thumbnail.value?.background.type === "color" && (
            <LabelAndField
              label="Color"
              fieldComponent={
                <EditField
                  fieldName="color"
                  value={thumbnail.value?.background.color}
                  defaultValue="transparent"
                  onUpdate={onUpdate}
                />
              }
            />
          )}
          {thumbnail.value?.background.type === "image" && (
            <ImageMenu
              selectedImageId={thumbnail.value?.background.imageId || ""}
              transparent={thumbnail.value?.background.transparent || false}
              zoom={thumbnail.value?.background.zoom || 1}
              x={thumbnail.value?.background.x || 50}
              y={thumbnail.value?.background.y || 50}
              onUpdate={onUpdate}
              aiImageWidth={1280}
              aiImageHeight={720}
            />
          )}

          {thumbnail.value?.background.type === "video" && (
            <VideoMenu onUpdate={onUpdate} />
          )}
        </Container>
      </div>
    </div>
  );
}
