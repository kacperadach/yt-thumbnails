import { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  selectedAsset,
  selectedMenu,
  thumbnail,
  editingThumbnailId,
  thumbnails,
} from "../../lib/signals";
import { ThumbnailAsset } from "../../lib/types";
import EditMenuContainer from "./EditMenuContainer";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import EditorSidebar from "./EditorSidebar";
import BackgroundMenu from "./background/BackgroundMenu";
import AssetsMenu from "./asset/AssetsMenu";
import { useLocation } from "react-router-dom";
import { fetchThumbnails } from "../../lib/api";

export default function Editor() {
  const location = useLocation();

  const [previewWidth, setPreviewWidth] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getThumbnails = async () => {
      if (thumbnails.value.length > 0) {
        return;
      }

      const thumbnailId = location.pathname
        .replace("edit", "")
        .replaceAll("/", "");

      const response = await fetchThumbnails([thumbnailId]);
      if (!response.success) {
        return;
      }

      thumbnails.value = response.data;

      if (!editingThumbnailId.value) {
        editingThumbnailId.value = thumbnailId;
      }
    };

    getThumbnails();
  }, []);

  useEffect(() => {
    const setWidth = () => {
      if (!previewRef.current) {
        setTimeout(setWidth, 50);
        return;
      }
      const previewWidth = previewRef.current?.clientWidth;
      setPreviewWidth(previewWidth - remToPx(3));
    };

    setWidth();
  }, []);

  const onUpdate = (newFields: Object) => {
    if (!thumbnail.value || !selectedAsset.value || !editingThumbnailId.value) {
      return;
    }

    thumbnails.value = thumbnails.value.map((t) => {
      if (t.id === editingThumbnailId.value) {
        return {
          ...t,
          background: t.background,
          assets: t.assets.map((asset) => {
            if (asset.id === selectedAsset.value?.id) {
              return {
                ...asset,
                ...newFields,
              };
            }
            return asset;
          }),
        };
      }
      return t;
    });
  };

  if (!thumbnail.value) {
    return null;
  }

  return (
    <Container fluid className="flex-1 max-h-full flex h-full w-full">
      <Row className="max-h-full w-full">
        <Col md={1} style={{ minWidth: "12rem" }} className="max-h-full">
          <EditorSidebar />
        </Col>
        <Col
          md={7}
          ref={previewRef}
          className="flex justify-center flex-column"
          style={{ height: "fit-content" }}
        >
          {previewWidth && (
            <div className=" rounded-xl shadow-lg p-2 flex justify-center items-center">
              <ThumbnailPreview
                thumbnail={thumbnail.value}
                editable={true}
                width={previewWidth}
                height={previewWidth * (9 / 16)}
              />
            </div>
          )}
        </Col>
        <Col
          className="w-full max-h-full overflow-scroll"
          style={{ minWidth: "15rem" }}
        >
          {(selectedMenu.value || selectedAsset.value) && (
            <div className="rounded-xl shadow-lg bg-white p-6 items-center">
              {selectedAsset.value && (
                <EditMenuContainer
                  thumbnailAsset={selectedAsset.value as ThumbnailAsset}
                  onUpdate={onUpdate}
                  handleDelete={() => {
                    thumbnails.value = thumbnails.value.map((t) => {
                      if (t.id === editingThumbnailId.value) {
                        return {
                          ...t,
                          assets: t.assets.filter(
                            (asset) => asset.id !== selectedAsset.value?.id
                          ),
                        };
                      }
                      return t;
                    });

                    selectedMenu.value = "assets";
                  }}
                />
              )}
              {selectedMenu.value === "background" && <BackgroundMenu />}
              {selectedMenu.value === "assets" && <AssetsMenu />}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
