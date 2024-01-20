import { Col, Container, Row } from "react-bootstrap";
import VideoPreview from "./VideoPreview";
import { FaTwitch, FaYoutube } from "react-icons/fa6";
import { thumbnail, videos } from "../../../lib/signals";
import LabelAndField from "../LabelAndField";
import TimeField from "../TimeField";
import EditField from "../EditField";
import VideoGallery from "./VideoGallery";
import { Button, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface VideoMenuProps {
  onUpdate: (newFields: Object) => void;
}

export default function VideoMenu(props: VideoMenuProps) {
  const { onUpdate } = props;

  const [showVideoGallery, setShowVideoGallery] = useState(false);

  const backgroundVideo = videos.value.find(
    (v) => v.id === thumbnail.value?.background.videoId
  );

  return (
    <>
      {!showVideoGallery && (
        <>
          <LabelAndField
            label="Video"
            fieldComponent={
              backgroundVideo ? (
                <Flex className="w-full" justify="start">
                  <VideoPreview
                    video={backgroundVideo}
                    onSelect={() => setShowVideoGallery(true)}
                  />
                </Flex>
              ) : (
                <Button onClick={() => setShowVideoGallery(true)}>
                  Select a Video
                </Button>
              )
            }
            wrap={!!backgroundVideo}
          />
          {/* <Row>
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
          </Row> */}

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

      {showVideoGallery && (
        <VideoGallery
          onUpdate={onUpdate}
          onBackClick={() => setShowVideoGallery(false)}
        />
      )}
    </>
  );
}
