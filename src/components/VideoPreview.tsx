import { Spinner } from "react-bootstrap";
import { VideoResource } from "../lib/types";

interface VideoPreviewProps {
  video: VideoResource;
  onSelect?: () => void;
}

export default function VideoPreview(props: VideoPreviewProps) {
  const { video, onSelect } = props;

  const isProcessing = !video.thumbnail_url || !video.url;

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
      {video.thumbnail_url && <img src={video.thumbnail_url} />}
      {isProcessing && (
        <div className="absolute">
          <Spinner color="black" />
        </div>
      )}
    </div>
  );
}
