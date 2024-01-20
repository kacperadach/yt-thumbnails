import { PiMaskSadLight } from "react-icons/pi";
import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchThumbnails } from "../../lib/api";
import { editingThumbnailId, homeLoading, thumbnails } from "../../lib/signals";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import { TEMPLATE_PREVIEW_WIDTH } from "../../lib/constants";
import { useNavigate } from "react-router-dom";
import Option from "./Option";
import { Text } from "@radix-ui/themes";

export default function Library() {
  const navigate = useNavigate();

  const [fetchedThumbnails, setFetchedThumbnails] = useState(false);

  useEffect(() => {
    const getThumbnails = async () => {
      homeLoading.value = true;
      const response = await fetchThumbnails();
      setFetchedThumbnails(true);
      homeLoading.value = false;
      if (response.success) {
        thumbnails.value = response.data;
      }
    };

    getThumbnails();
  }, []);

  return (
    <Container fluid>
      <div>
        <Row className="flex">
          {thumbnails.value &&
            thumbnails.value.map((thumbnail, index) => {
              return (
                <Option
                  key={index}
                  thumbnailOption={thumbnail}
                  onSelect={() => {
                    editingThumbnailId.value = thumbnail.id;
                    navigate(`/edit/${thumbnail.id}`);
                  }}
                />
              );
            })}

          {thumbnails.value.length === 0 && fetchedThumbnails && (
            <Col>
              <div className="flex flex-column justify-center items-center">
                <PiMaskSadLight size="5rem" className="text-brand-green" />
                <h1 className="text-2xl font-bold text-center">
                  No thumbnails found
                </h1>
                <Text>
                  To get started, create a Thumbnail from a template or start
                  from scratch.
                </Text>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
}
