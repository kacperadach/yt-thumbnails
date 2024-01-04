import { useState, useEffect, useMemo } from "react";
import { typeString } from "../lib/utils";
import { Flipper, Flipped } from "react-flip-toolkit";
import { Spinner } from "react-bootstrap";
import TimeField from "../components/edit/TimeField";

const VIDEO_URL = "https://www.youtube.com/watch?v=Ignr0g9ZHB0";

interface VideoUploadProps {
  onFinish: () => void;
}

export default function VideoUpload(props: VideoUploadProps) {
  const { onFinish } = props;

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [finishedProcessing, setFinishedProcessing] = useState<boolean>(false);

  const cacheKey = useMemo(() => {
    return videoUrl + isSearching + finishedProcessing;
  }, [videoUrl, isSearching, finishedProcessing]);

  useEffect(() => {
    setTimeout(() => {
      typeString(VIDEO_URL, 500, setVideoUrl);
    }, 500);

    setTimeout(() => {
      setIsSearching(true);
    }, 1000);

    setTimeout(() => {
      setIsSearching(false);
      setFinishedProcessing(true);
      onFinish();
    }, 2000);
  }, []);

  return (
    <Flipper flipKey={cacheKey} spring="wobbly">
      <Flipped flipId="video">
        <div
          className="border-2 border-gray-200 rounded-md p-1 text-sm"
          style={{ width: `${isSearching ? "fit-content" : "100%"}` }}
        >
          {!isSearching && !finishedProcessing && (
            <input
              className="rounded-md p-1 w-full text-sm"
              placeholder="Enter a YouTube/Twitch URL"
              value={videoUrl}
              disabled
            />
          )}
          {isSearching && !finishedProcessing && <Spinner />}
          {finishedProcessing && (
            <div className="flex items-center">
              <label className="text-lg mx-1">Video Time: </label>
              <TimeField time={4502} onChange={() => {}} />
            </div>
          )}
        </div>
      </Flipped>
    </Flipper>
  );
}
