import { useState, useEffect } from "react";
import { BsCardImage } from "react-icons/bs";
import { HiOutlineCollection } from "react-icons/hi";
import { BsDownload } from "react-icons/bs";
import { MdOutlineCheck } from "react-icons/md";
import { selectedAssetId, selectedMenu, thumbnail } from "../../lib/signals";
import { downloadFile } from "../../lib/utils";
import { fetchRender, initiateRender } from "../../lib/api";
import { Spinner } from "react-bootstrap";
import { useSignalEffect } from "@preact/signals-react";

interface EditorSidebarProps {}

export default function EditorSidebar(props: EditorSidebarProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderUrl, setRenderUrl] = useState("");

  useEffect(() => {
    if (renderUrl) {
      downloadFile(renderUrl, "thumbnail.png");
    }
  }, [renderUrl]);

  useSignalEffect(() => {
    if (thumbnail.value) {
      setRenderUrl("");
    }
  });

  const renderAndPoll = async () => {
    if (isRendering || !thumbnail.value) {
      return;
    }
    setIsRendering(true);

    const response = await initiateRender(thumbnail.value.id);
    if (!response.success) {
      setIsRendering(false);
      return;
    }

    const poll = async () => {
      const renderResponse = await fetchRender(response.data.id);
      if (!renderResponse.success || renderResponse.data.status === "failed") {
        setIsRendering(false);
        return;
      }

      if (renderResponse.data.status === "success") {
        setIsRendering(false);
        setRenderUrl(renderResponse.data.url);
        return;
      }

      setTimeout(poll, 1000);
    };

    poll();
  };

  return (
    <div className="flex-column rounded-xl shadow-lg">
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedMenu.value === "background" && "bg-gray-200"
        }`}
        onClick={() => {
          selectedAssetId.value = null;
          selectedMenu.value = "background";
        }}
      >
        <BsCardImage size="3rem" />
        <span>Background</span>
      </div>
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedMenu.value === "assets" && "bg-gray-200"
        }`}
        onClick={() => {
          selectedAssetId.value = null;
          selectedMenu.value = "assets";
        }}
      >
        <HiOutlineCollection size="3rem" />
        <span>Assets</span>
      </div>
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer `}
        onClick={() => {
          if (isRendering) {
            return;
          }

          if (renderUrl) {
            downloadFile(renderUrl, "thumbnail.png");
          } else {
            renderAndPoll();
          }
        }}
      >
        {isRendering && <Spinner style={{ width: "3rem", height: "3rem" }} />}
        {!isRendering && !renderUrl && <BsDownload size="3rem" />}
        {!isRendering && renderUrl && (
          <MdOutlineCheck color="green" size="3rem" />
        )}

        <span>
          {isRendering && "Rendering"}
          {!isRendering && !renderUrl && "Render"}
          {!isRendering && renderUrl && "Download"}
        </span>
      </div>
    </div>
  );
}
