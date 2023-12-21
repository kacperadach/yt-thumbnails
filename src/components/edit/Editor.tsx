import { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  DEFAULT_TEXT_OBJECT,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from "../../lib/constants";
import {
  selectedAsset,
  selectedMenu,
  thumbnail,
  thumbnailWithCreatingAsset,
  editingThumbnailId,
  thumbnails,
} from "../../lib/signals";
import { ThumbnailAsset } from "../../lib/types";
import EditMenuContainer from "./EditMenuContainer";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import EditorSidebar from "./EditorSidebar";
import BackgroundMenu from "./BackgroundMenu";
import AssetsMenu from "./asset/AssetsMenu";
import { useSignalEffect, signal, computed } from "@preact/signals-react";

export default function Editor() {
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setWidth = () => {
      if (!previewRef.current) {
        setTimeout(setWidth, 50);
        return;
      }
      const previewWidth = previewRef.current?.clientWidth;
      setPreviewWidth(previewWidth - remToPx(2));
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

    // thumbnail.value = {
    //   ...thumbnail.value,
    //   background: thumbnail.value.background,
    //   assets: thumbnail.value.assets.map((asset) => {
    //     if (asset.id === selectedAsset.value?.id) {
    //       return {
    //         ...asset,
    //         ...newFields,
    //       };
    //     }
    //     return asset;
    //   }),
    // };
  };

  if (!thumbnailWithCreatingAsset.value) {
    return null;
  }

  return (
    <Container fluid className="flex">
      <Row className="w-full">
        <Col md={1}>
          <EditorSidebar />
        </Col>
        <Col md={8} ref={previewRef} className="flex justify-center">
          {previewWidth && (
            <div className=" rounded-xl shadow-lg p-3">
              <ThumbnailPreview
                thumbnail={thumbnailWithCreatingAsset.value}
                editable={true}
                width={previewWidth}
                height={previewWidth * (9 / 16)}
              />
            </div>
          )}
        </Col>
        <Col md={3} className="w-full my-2">
          {selectedAsset.value && (
            <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
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
                }}
              />
            </div>
          )}
          {selectedMenu.value === "background" && (
            <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
              <BackgroundMenu />
            </div>
          )}
          {selectedMenu.value === "assets" && (
            <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
              <AssetsMenu />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
