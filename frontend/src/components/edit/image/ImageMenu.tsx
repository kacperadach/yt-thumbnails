import { Text, Button, Flex } from "@radix-ui/themes";
import { HiMiniSparkles } from "react-icons/hi2";
import LabelAndField from "../LabelAndField";
import SelectableImage from "./SelectableImage";
import {
  AIImageResource,
  DropShadow,
  ImageOutline,
  ImageResource,
} from "../../../lib/types";
import EditField from "../EditField";
import UploadedImageGallery from "./UploadedImageGallery";
import { useState } from "react";
import { aiImages, images, thumbnail } from "../../../lib/signals";
import AIImageGenerator from "./AIImageGenerator";
import { Accordion } from "react-bootstrap";
import AccordionItem from "../AccordionItem";
import EditMenu from "../EditMenu";
import {
  DEFAULT_DROP_SHADOW_OBJECT,
  DEFAULT_IMAGE_OUTLINE,
} from "../../../lib/constants";

interface ImageMenuProps {
  selectedImageId: string;
  transparent: boolean;
  zoom?: number;
  x: number;
  y: number;
  dropShadow?: DropShadow;
  onUpdate: (value: any) => void;
  aiImageWidth?: number;
  aiImageHeight?: number;
  imageOutline?: ImageOutline;
}

export default function ImageMenu(props: ImageMenuProps) {
  const {
    selectedImageId,
    transparent,
    zoom,
    x,
    y,
    dropShadow,
    onUpdate,
    aiImageWidth,
    aiImageHeight,
    imageOutline,
  } = props;

  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const selectedImage =
    images.value.find((i) => i.id === selectedImageId) ||
    aiImages.value.find((i) => i.id === selectedImageId);

  if (showImageGenerator) {
    return (
      <AIImageGenerator
        onBackClick={() => setShowImageGenerator(false)}
        unModifiableWidth={aiImageWidth}
        unModifiableHeight={aiImageHeight}
        onImageGenerated={(
          image: AIImageResource,
          width: number,
          height: number
        ) => {
          onUpdate({
            src: image.url,
            imageId: image.id,
            transparent: false,
            zoom: 1,
            width,
            height,
            // x: 50,
            // y: 50,
            imageType: "ai",
          });
        }}
      />
    );
  }

  return (
    <>
      <Flex mt="4" mb="2">
        <Button
          className="w-full py-4"
          onClick={() => setShowImageGenerator(true)}
        >
          <HiMiniSparkles />
          <Text size="5">Generate Image using AI</Text>
          <HiMiniSparkles />
        </Button>
      </Flex>

      {!showImageGallery && (
        <>
          <LabelAndField
            label="Image"
            fieldComponent={
              selectedImage ? (
                <Flex className="w-full" justify="start">
                  <SelectableImage
                    image={selectedImage}
                    handleSelect={() => {
                      setShowImageGallery(true);
                    }}
                    width="10rem"
                  />
                </Flex>
              ) : (
                <Button onClick={() => setShowImageGallery(true)}>
                  Select an Image
                </Button>
              )
            }
            wrap={!!selectedImage}
          />

          <LabelAndField
            label="Transparent"
            fieldComponent={
              <EditField
                fieldName="transparent"
                value={transparent}
                defaultValue={false}
                onUpdate={(newFields: any) => {
                  const fields = { ...newFields };

                  const imageResource = images.value.find(
                    (image) => image.id === selectedImageId
                  );

                  const aiImageResource = aiImages.value.find(
                    (image) => image.id === selectedImageId
                  );

                  if (imageResource) {
                    fields["src"] = newFields["transparent"]
                      ? imageResource.url_transparent
                      : imageResource.url;
                  } else if (aiImageResource) {
                    fields["src"] = newFields["transparent"]
                      ? aiImageResource.url_transparent
                      : aiImageResource.url;
                  }

                  onUpdate(fields);
                }}
              />
            }
          />

          {zoom !== undefined && (
            <LabelAndField
              label="Zoom"
              fieldComponent={
                <EditField
                  fieldName="zoom"
                  value={zoom}
                  defaultValue={1}
                  onUpdate={onUpdate}
                  step={0.1}
                />
              }
            />
          )}
          <LabelAndField
            label="X"
            fieldComponent={
              <EditField
                fieldName="x"
                value={x}
                defaultValue={50}
                onUpdate={onUpdate}
              />
            }
          />

          <LabelAndField
            label="Y"
            fieldComponent={
              <EditField
                fieldName="y"
                value={y}
                defaultValue={50}
                onUpdate={onUpdate}
              />
            }
          />
          <div className="py-2 border-b-2 border-gray-200 cursor-pointer">
            <AccordionItem
              value={"imageOutline"}
              label={"Image Outline"}
              body={
                <EditMenu
                  asset={imageOutline}
                  defaultObject={DEFAULT_IMAGE_OUTLINE}
                  onUpdate={(newFields: Object) => {
                    onUpdate({
                      imageOutline: { ...imageOutline, ...newFields },
                    });
                  }}
                />
              }
            />
          </div>
        </>
      )}
      {/* {dropShadow && (
        <div className="py-2 border-b-2 border-gray-200 cursor-pointer">
          <AccordionItem
            value={"dropShadow"}
            label={"Drop Shadow"}
            body={
              <EditMenu
                asset={dropShadow}
                defaultObject={DEFAULT_DROP_SHADOW_OBJECT}
                onUpdate={(newFields: Object) => {
                  onUpdate({ dropShadow: { ...dropShadow, ...newFields } });
                }}
              />
            }
          />
        </div>
      )} */}

      {showImageGallery && (
        <UploadedImageGallery
          handleSelect={(
            image: ImageResource | AIImageResource,
            imageType: "upload" | "ai"
          ) => {
            onUpdate({
              src: image.url,
              imageId: image.id,
              transparent: false,
              zoom: 1,

              imageType,
            });
          }}
          onBackClick={() => setShowImageGallery(false)}
        />
      )}
    </>
  );
}
