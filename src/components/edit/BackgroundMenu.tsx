import {
  thumbnail,
  thumbnails,
  editingThumbnailId,
  processingVideoId,
  videos,
  images,
} from "../../lib/signals";
import { IoColorPaletteSharp } from "react-icons/io5";
import { RiVideoAddFill } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import EditField from "./EditField";
import { Col, Container, Row } from "react-bootstrap";
import { ImageResource, VideoResource } from "../../lib/types";
import { FaTwitch, FaYoutube } from "react-icons/fa6";
import { processVideo } from "../../lib/api";
import VideoPreview from "../VideoPreview";
import UploadedImageGallery from "../UploadedImageGallery";
import TimeField from "./TimeField";
import VideoGallery from "../VideoGallery";

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
            <Row className="flex my-1 items-center">
              <Col md={3}>
                <label className="font-bold mx-2 ">Color</label>
              </Col>
              <Col className="flex">
                <EditField
                  fieldName="color"
                  value={thumbnail.value?.background.color}
                  defaultValue="transparent"
                  onUpdate={onUpdate}
                />
              </Col>
            </Row>
          )}
          {thumbnail.value?.background.type === "image" && (
            <>
              <Row className="flex my-1 items-center">
                <Col md={3}>
                  <label className="font-bold mx-2">Image Url</label>
                </Col>
                <Col className="flex">
                  <EditField
                    fieldName="imageSrc"
                    value={thumbnail.value?.background.imageSrc}
                    defaultValue=""
                    onUpdate={onUpdate}
                  />
                </Col>
              </Row>
              {thumbnail.value?.background.imageId && (
                <Row className="flex my-1 items-center">
                  <Col md={3}>
                    <label className="font-bold mx-2">Transparent</label>
                  </Col>
                  <Col className="flex">
                    <EditField
                      fieldName="transparent"
                      value={thumbnail.value?.background.transparent}
                      defaultValue={false}
                      onUpdate={(newFields: any) => {
                        const fields = { ...newFields };

                        const imageResource = images.value.find(
                          (image) =>
                            image.id === thumbnail.value?.background.imageId
                        );
                        console.log(imageResource, newFields["transparent"]);
                        if (imageResource) {
                          fields["imageSrc"] = newFields["transparent"]
                            ? imageResource.url_transparent
                            : imageResource.url;
                        }

                        onUpdate(fields);
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row className="flex my-1 items-center">
                <Col md={3}>
                  <label className="font-bold mx-1">Zoom</label>
                </Col>
                <Col className="flex">
                  <EditField
                    fieldName="zoom"
                    value={thumbnail.value?.background.zoom}
                    defaultValue={1}
                    onUpdate={onUpdate}
                    step={0.1}
                  />
                </Col>
              </Row>
              <Row className="flex my-1 items-center">
                <Col md={3}>
                  <label className="font-bold mx-1">X</label>
                </Col>
                <Col className="flex">
                  <EditField
                    fieldName="x"
                    value={thumbnail.value?.background.x}
                    defaultValue={50}
                    onUpdate={onUpdate}
                  />
                </Col>
              </Row>
              <Row className="flex my-1 items-center">
                <Col md={3}>
                  <label className="font-bold mx-1">Y</label>
                </Col>
                <Col className="flex">
                  <EditField
                    fieldName="y"
                    value={thumbnail.value?.background.y}
                    defaultValue={50}
                    onUpdate={onUpdate}
                  />
                </Col>
              </Row>
              <UploadedImageGallery
                handleSelect={(image: ImageResource) => {
                  onUpdate({
                    imageSrc: image.url_transparent,
                    imageId: image.id,
                    transparent: true,
                  });
                }}
              />
            </>
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
                  <Row className="flex my-1 items-center">
                    <Col md={3}>
                      <label className="font-bold mx-1">Video Time</label>
                    </Col>
                    <Col className="flex">
                      <TimeField
                        time={thumbnail.value?.background.videoTime || 0}
                        onChange={(newTime: number) => {
                          onUpdate({ videoTime: newTime });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col md={3}>
                      <label className="font-bold mx-1">Zoom</label>
                    </Col>
                    <Col className="flex">
                      <EditField
                        fieldName="zoom"
                        value={thumbnail.value?.background.zoom}
                        defaultValue={1}
                        onUpdate={onUpdate}
                        step={0.1}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col md={3}>
                      <label className="font-bold mx-1">X</label>
                    </Col>
                    <Col className="flex">
                      <EditField
                        fieldName="x"
                        value={thumbnail.value?.background.x}
                        defaultValue={50}
                        onUpdate={onUpdate}
                      />
                    </Col>
                  </Row>
                  <Row className="my-1">
                    <Col md={3}>
                      <label className="font-bold mx-1">Y</label>
                    </Col>
                    <Col className="flex">
                      <EditField
                        fieldName="y"
                        value={thumbnail.value?.background.y}
                        defaultValue={50}
                        onUpdate={onUpdate}
                      />
                    </Col>
                  </Row>
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
