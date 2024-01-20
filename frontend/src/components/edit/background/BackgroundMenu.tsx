import {
  thumbnail,
  thumbnails,
  editingThumbnailId,
  videos,
  images,
} from "../../../lib/signals";
import { IoColorPaletteSharp } from "react-icons/io5";
import { RiVideoAddFill } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import EditField from "../EditField";
import { Col, Container, Row } from "react-bootstrap";
import { Image, ImageResource, VideoResource } from "../../../lib/types";
import { FaTwitch, FaYoutube } from "react-icons/fa6";
import { processVideo } from "../../../lib/api";
import VideoPreview from "../VideoPreview";
import UploadedImageGallery from "../image/UploadedImageGallery";
import TimeField from "../TimeField";
import VideoGallery from "../VideoGallery";
import LabelAndField from "../LabelAndField";
import SelectableImage from "../image/SelectableImage";
import { useState } from "react";
import { Button, Text } from "@radix-ui/themes";
import { HiMiniSparkles } from "react-icons/hi2";
import ImageMenu from "../image/ImageMenu";

export default function BackgroundMenu() {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

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

  const backgroundVideo = videos.value.find(
    (v) => v.id === thumbnail.value?.background.videoId
  );

  return (
    <div>
      <div>
        <h4 className="text-4xl font-bold my-1">Editing Background</h4>
      </div>
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
            <>
              {backgroundVideo && (
                <>
                  <Row>
                    <Col md={5}>
                      <VideoPreview video={backgroundVideo} />
                    </Col>
                    <Col className="flex-column overflow-hidden items-bottom h-full">
                      <div>
                        {backgroundVideo.platform === "youtube" && (
                          <FaYoutube size="2rem" color="#FF0000" />
                        )}
                        {backgroundVideo.platform === "twitch" && (
                          <FaTwitch size="2rem" color="#6441A5" />
                        )}
                        <a
                          href={backgroundVideo.original_url}
                          target="_blank"
                          className="text-sm text-nowrap"
                        >
                          {backgroundVideo.original_url}
                        </a>
                      </div>
                    </Col>
                  </Row>

                  <LabelAndField
                    label="Video Time"
                    fieldComponent={
                      <TimeField
                        time={thumbnail.value?.background.videoTime || 0}
                        onChange={(newTime: number) => {
                          onUpdate({ videoTime: newTime });
                        }}
                      />
                    }
                  />

                  <LabelAndField
                    label="Zoom"
                    fieldComponent={
                      <EditField
                        fieldName="zoom"
                        value={thumbnail.value?.background.zoom}
                        defaultValue={1}
                        onUpdate={onUpdate}
                        step={0.1}
                      />
                    }
                  />

                  <LabelAndField
                    label="X"
                    fieldComponent={
                      <EditField
                        fieldName="x"
                        value={thumbnail.value?.background.x}
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
                        value={thumbnail.value?.background.y}
                        defaultValue={50}
                        onUpdate={onUpdate}
                      />
                    }
                  />
                </>
              )}
              <VideoGallery onUpdate={onUpdate} />
            </>
          )}
        </Container>
      </div>
    </div>
  );
}
