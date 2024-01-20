import { useState, useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  isPollingVideos,
  processingVideoId,
  videos,
} from "../../../lib/signals";
import { FaTwitch, FaYoutube } from "react-icons/fa6";
import { VideoResource } from "../../../lib/types";
import { fetchVideos, processVideo } from "../../../lib/api";
import VideoPreview from "./VideoPreview";
import { isVideoProcessing } from "../../../lib/utils";
import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";

interface VideoGalleryProps {
  onUpdate: (newFields: Object) => void;
  onBackClick: () => void;
}

export default function VideoGallery(props: VideoGalleryProps) {
  const { onUpdate, onBackClick } = props;

  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showUploadVideo, setShowUploadVideo] = useState(false);

  const onVideoProcess = async () => {
    setUrl("");
    setProcessing(true);
    const response = await processVideo(url);

    if (!response.success) {
      setProcessing(false);
      return;
    }

    setShowUploadVideo(false);

    const video = response.data as VideoResource;
    processingVideoId.value = video.id;
    videos.value = [...videos.value, video];
    if (!isPollingVideos.value) {
      isPollingVideos.value = true;
      fetchVideosAndPoll();
    }
  };

  const fetchVideosAndPoll = async (videoIds: string[] = []) => {
    const response = await fetchVideos(
      videoIds.length > 0 ? videoIds : undefined
    );
    if (!response.success) {
      setProcessing(false);
      isPollingVideos.value = false;
      return;
    }
    videos.value = [
      ...response.data,
      ...videos.value.filter(
        (v) => !response.data.find((v2: VideoResource) => v.id === v2.id)
      ),
    ];

    if (
      videos.value.find(
        (v) => !isVideoProcessing(v) && v.id === processingVideoId.value
      )
    ) {
      processingVideoId.value = null;
    }

    const processingVideoIds = videos.value
      .filter((v: VideoResource) => isVideoProcessing(v))
      .map((v: VideoResource) => v.id);
    if (processingVideoIds.length === 0) {
      isPollingVideos.value = false;
      setProcessing(false);
      return;
    }

    setTimeout(() => fetchVideosAndPoll(processingVideoIds), 3000);
  };

  useEffect(() => {
    if (!isPollingVideos.value) {
      isPollingVideos.value = true;
      fetchVideosAndPoll();
    }
  }, []);

  return (
    <>
      <Row className="mt-2 pt-2">
        <Col>
          <IconButton
            onClick={() => {
              onBackClick();
            }}
          >
            <IoMdArrowRoundBack />
          </IconButton>
        </Col>
      </Row>
      {!showUploadVideo && (
        <>
          <Row className="py-2">
            <Col>
              <h4 className="m-0">Video Library</h4>
            </Col>
          </Row>
          <Row className="border-t-2">
            <Flex justify="between" my="2">
              <Button mx="1" onClick={() => setShowUploadVideo(true)}>
                <Text>Upload New Video</Text>
                <IoCloudUploadOutline />
              </Button>
            </Flex>
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
      {showUploadVideo && (
        <>
          <Row>
            <Col>
              <div className="p-4">
                <h4>Use a YouTube or Twitch frame as your background!</h4>
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
              <Button
                className="p-2 border bg-green-200 rounded font-bold"
                onClick={onVideoProcess}
              >
                {processing ? <Spinner /> : <Text>Process</Text>}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* {!processingVideoId.value && (
        <>
          <Row>
            <Col>
              <div className="p-4">
                <h4>Use a YouTube or Twitch frame as your background!</h4>
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
              <Button
                className="p-2 border bg-green-200 rounded font-bold"
                onClick={onVideoProcess}
              >
                {processing ? <Spinner /> : <Text>Process</Text>}
              </Button>
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
      )} */}
    </>
  );
}
