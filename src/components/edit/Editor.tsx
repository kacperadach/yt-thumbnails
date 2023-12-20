import { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  DEFAULT_TEXT_OBJECT,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from "../../lib/constants";
import { selectedAsset, selectedMenu, thumbnail } from "../../lib/signals";
import { ThumbnailAsset } from "../../lib/types";
import EditMenuContainer from "./EditMenuContainer";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import EditorSidebar from "./EditorSidebar";
import BackgroundMenu from "./BackgroundMenu";
import AssetsMenu from "./AssetsMenu";

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

  if (!thumbnail.value) {
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
            <ThumbnailPreview
              thumbnail={thumbnail.value}
              editable={true}
              width={previewWidth}
              height={previewWidth * (9 / 16)}
            />
          )}
        </Col>
        <Col md={3} className="w-full">
          {selectedAsset.value && <EditMenuContainer />}
          {selectedMenu.value === "background" && <BackgroundMenu />}
          {selectedMenu.value === "assets" && <AssetsMenu />}
        </Col>
      </Row>
    </Container>
  );
}
