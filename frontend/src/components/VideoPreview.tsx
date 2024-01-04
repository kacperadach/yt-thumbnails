import { Spinner } from "react-bootstrap";
import { VideoResource } from "../lib/types";
import { BsX } from "react-icons/bs";
import { isVideoFailed, isVideoProcessing } from "../lib/utils";

interface VideoPreviewProps {
  video: VideoResource;
  onSelect?: () => void;
}

export default function VideoPreview(props: VideoPreviewProps) {
  const { video, onSelect } = props;

  const isProcessing = isVideoProcessing(video);
  const failed = isVideoFailed(video);

  return (
    <div
      className={`p-2 rounded w-full h-full flex items-center justify-center relative ${
        (isProcessing || failed) && "opacity-50 cursor-not-allowed"
      } ${!isProcessing && !failed && "hover:bg-gray-300 cursor-pointer"}`}
      onClick={() => {
        if (isProcessing || failed || !onSelect) {
          return;
        }
        onSelect();
      }}
    >
      {video.thumbnail_url && (
        <img
          src={video.thumbnail_url}
          style={{
            opacity: isProcessing || failed ? 0.5 : 1,
          }}
        />
      )}
      {isProcessing && (
        <div className="absolute">
          <Spinner color="black" />
        </div>
      )}
      {failed && (
        <div className="flex flex-column justify-center items-center absolute font-bold">
          <BsX color="red" size="4rem" />
          <span>Failed to Process</span>
        </div>
      )}
    </div>
  );
}
