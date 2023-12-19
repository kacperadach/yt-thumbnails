import { useRef, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  DEFAULT_TEXT_OBJECT,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from "../lib/constants";
import { selectedAsset, thumbnail } from "../lib/signals";
import { ThumbnailAsset } from "../lib/types";
import EditMenuContainer from "./edit/EditMenuContainer";
import ThumbnailPreview from "./thumbnails/ThumbnailComposition";
import { remToPx } from "../lib/utils";

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

        {selectedAsset.value && (
          <Col md={4} className="w-full">
            <EditMenuContainer />
          </Col>
        )}
      </Row>
    </Container>
  );
}
