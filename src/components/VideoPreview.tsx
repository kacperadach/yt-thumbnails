import { Spinner } from "react-bootstrap";
import { VideoResource } from "../lib/types";
import { BsX } from "react-icons/bs";

interface VideoPreviewProps {
  video: VideoResource;
  onSelect?: () => void;
}

export default function VideoPreview(props: VideoPreviewProps) {
  const { video, onSelect } = props;

  const isProcessing = video.status === "pending";

  return (
    <div
      className={`p-2 rounded w-full h-full flex items-center justify-center relative ${
        isProcessing && "opacity-50 cursor-not-allowed"
      } ${!isProcessing && "hover:bg-gray-300 cursor-pointer"}`}
      onClick={() => {
        if (isProcessing || !onSelect) {
          return;
        }
        onSelect();
      }}
    >
      {video.thumbnail_url && (
        <img
          src={video.thumbnail_url}
          style={{
            opacity: isProcessing || video.status === "failed" ? 0.5 : 1,
          }}
        />
      )}
      {isProcessing && (
        <div className="absolute">
          <Spinner color="black" />
        </div>
      )}
      {video.status === "failed" && (
        <div className="flex flex-column justify-center items-center absolute font-bold">
          <BsX color="red" size="4rem" />
          <span>Failed to Process</span>
        </div>
      )}
    </div>
  );
}
