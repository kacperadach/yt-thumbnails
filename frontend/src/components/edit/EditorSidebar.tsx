import { useState, useEffect } from "react";
import { BsCardImage } from "react-icons/bs";
import { HiOutlineCollection } from "react-icons/hi";
import { BsDownload } from "react-icons/bs";
import { MdOutlineCheck } from "react-icons/md";
import {
  addSuccessAlert,
  alerts,
  selectedAssetId,
  selectedMenu,
  templates,
  thumbnail,
} from "../../lib/signals";
import { downloadFile } from "../../lib/utils";
import { fetchRender, initiateRender, saveTemplate } from "../../lib/api";
import { Spinner } from "react-bootstrap";
import { useSignalEffect } from "@preact/signals-react";
import { IoIosSave } from "react-icons/io";

interface EditorSidebarProps {}

export default function EditorSidebar(props: EditorSidebarProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderUrl, setRenderUrl] = useState("");

  const [savingTemplate, setSavingTemplate] = useState(false);

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
        addSuccessAlert("Thumbnail Rendered!");
        return;
      }

      setTimeout(poll, 1500);
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
        onClick={async () => {
          if (!thumbnail.value) {
            return;
          }
          setSavingTemplate(true);

          const response = await saveTemplate("", thumbnail.value);
          if (response.success) {
            addSuccessAlert("Template Saved!");
            templates.value.push(response.data);
          }
          setSavingTemplate(false);
        }}
      >
        {savingTemplate ? (
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        ) : (
          <IoIosSave size="3rem" />
        )}
        <span>{savingTemplate ? "Saving" : "Save as Template"}</span>
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
