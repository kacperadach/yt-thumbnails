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
import { Flex, Tooltip } from "@radix-ui/themes";
import ImageMenu from "../image/ImageMenu";
import VideoMenu from "../video/VideoMenu";
import { FaMagic } from "react-icons/fa";
import { useState } from "react";
import EditMenu from "../EditMenu";
import { DEFAULT_EMPTY_EFFECTS_OBJECT } from "../../../lib/constants";
import { ThumbnailAsset } from "../../../lib/types";
import * as Accordion from "@radix-ui/react-accordion";

export default function BackgroundMenu() {
  const [menuSelected, setMenuSelected] = useState<"effects" | null>(null);

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
          <Tooltip content="Color" dir="top">
            <div
              className={`p-3 border mx-2 ${
                thumbnail.value?.background.type === "color" &&
                !menuSelected &&
                "bg-gray-200"
              }`}
              onClick={() => {
                setMenuSelected(null);
                onUpdate({ type: "color" });
              }}
            >
              <IoColorPaletteSharp size="2rem" />
            </div>
          </Tooltip>
          <Tooltip content="Image" dir="top">
            <div
              className={`p-3 border mx-2 ${
                thumbnail.value?.background.type === "image" &&
                !menuSelected &&
                "bg-gray-200"
              }`}
              onClick={() => {
                setMenuSelected(null);
                onUpdate({ type: "image" });
              }}
            >
              <BsCardImage size="2rem" />
            </div>
          </Tooltip>
          <Tooltip content="Video" dir="top">
            <div
              className={`p-3 border mx-2 ${
                thumbnail.value?.background.type === "video" &&
                !menuSelected &&
                "bg-gray-200"
              }`}
              onClick={() => {
                setMenuSelected(null);
                onUpdate({ type: "video" });
              }}
            >
              <RiVideoAddFill size="2rem" />
            </div>
          </Tooltip>
          <Tooltip content="Effects" dir="top">
            <div
              className={`p-3 border mx-2 ${
                menuSelected === "effects" && "bg-gray-200"
              }`}
              onClick={() => setMenuSelected("effects")}
            >
              <FaMagic size="2rem" />
            </div>
          </Tooltip>
        </div>
        <Container>
          {thumbnail.value?.background.type === "color" && !menuSelected && (
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
          {thumbnail.value?.background.type === "image" && !menuSelected && (
            <Accordion.Root type="multiple">
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
            </Accordion.Root>
          )}

          {thumbnail.value?.background.type === "video" && !menuSelected && (
            <VideoMenu onUpdate={onUpdate} />
          )}

          {menuSelected === "effects" && (
            <Accordion.Root type="multiple">
              <EditMenu
                defaultObject={DEFAULT_EMPTY_EFFECTS_OBJECT}
                onUpdate={onUpdate}
                asset={thumbnail.value?.background as ThumbnailAsset}
                filterFields={[
                  "blur",
                  "brightness",
                  "contrast",
                  "dropShadow",
                  "grayscale",
                  "hueRotate",
                  "invert",
                  "opacity",
                  "saturate",
                  "sepia",
                ]}
              />
            </Accordion.Root>
          )}
        </Container>
      </div>
    </div>
  );
}
