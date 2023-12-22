import { useState } from "react";
import {
  thumbnail,
  thumbnails,
  editingThumbnailId,
  processingVideoId,
  videos,
  images,
} from "../../lib/signals";
import { IoColorPaletteSharp } from "react-icons/io5";
import { FaFileImage, FaFileVideo } from "react-icons/fa";
import { RiVideoAddFill } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import EditField from "./EditField";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import {
  Arrow,
  Circle,
  Image,
  ImageResource,
  ThumbnailAsset,
  VideoResource,
} from "../../lib/types";
import { FaTwitch, FaYoutube } from "react-icons/fa6";
import { processVideo } from "../../lib/api";
import VideoPreview from "../VideoPreview";
import UploadedImageGallery from "../UploadedImageGallery";
import TimeField from "./TimeField";

export default function BackgroundMenu() {
  const [url, setUrl] = useState("");

  const onVideoProcess = async () => {
    setUrl("");
    const response = await processVideo(url);
    if (response.success) {
      const video = response.data as VideoResource;
      processingVideoId.value = video.id;
      videos.value = [...videos.value, video];
    }
  };

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

              {!processingVideoId.value && (
                <>
                  <Row className="border-t-2 mt-4">
                    <Col>
                      <div className="p-4">
                        <h4>
                          Use a YouTube or Twitch frame as your background!
                        </h4>
                      </div>
                    </Col>
                  </Row>
                  <Row className="flex my-1 items-center">
                    <Col md={2}>
                      <div className="flex">
                        <div className="mx-1">
                          <FaYoutube size="1.5rem" color="#FF0000" />
                        </div>
                        <div className="mx-1">
                          <FaTwitch size="1.5rem" color="#6441A5" />
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <input
                        className="border-2 border-gray-200 rounded-md p-1 w-full text-sm"
                        placeholder="Enter a YouTube/Twitch URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </Col>
                    <Col md={2}>
                      <button
                        className="p-2 border bg-green-200 rounded font-bold"
                        onClick={onVideoProcess}
                      >
                        Process
                      </button>
                    </Col>
                  </Row>
                </>
              )}
              {processingVideoId.value && (
                <div className="my-4">
                  <Row>
                    <Col className="flex justify-center">
                      <h4 className="mx-2">Processing video</h4>
                      <Spinner />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <span>This may take a bit.</span>
                    </Col>
                  </Row>
                </div>
              )}
              {videos.value.length > 0 && (
                <>
                  <Row>
                    <Col>
                      <h4>All Videos</h4>
                    </Col>
                  </Row>
                  <Row>
                    {videos.value
                      .slice() // Creates a shallow copy of the array
                      .sort((a, b) => {
                        const timestampA = new Date(a.created_at).getTime();
                        const timestampB = new Date(b.created_at).getTime();
                        return timestampB - timestampA;
                      })
                      .map((video: VideoResource, index) => (
                        <Col md={4} key={index}>
                          <VideoPreview
                            video={video}
                            onSelect={() => {
                              onUpdate({
                                videoId: video.id,
                                videoSrc: video.url,
                                videoTime: 0,
                                zoom: 1,
                                x: 50,
                                y: 50,
                              });
                            }}
                          />
                        </Col>
                      ))}
                  </Row>
                </>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
}
