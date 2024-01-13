import { PiMaskSadLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchThumbnails } from "../../lib/api";
import { editingThumbnailId, homeLoading, thumbnails } from "../../lib/signals";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import { TEMPLATE_PREVIEW_WIDTH } from "../../lib/constants";
import { useNavigate } from "react-router-dom";

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
                <Col
                  key={index}
                  md={2}
                  className="px-6 max-w-sm mx-8 my-2 rounded-xl shadow-lg flex items-center hover:bg-brand-green transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => {
                    editingThumbnailId.value = thumbnail.id;
                    navigate(`/edit/${thumbnail.id}`);
                  }}
                >
                  <ThumbnailPreview
                    thumbnail={thumbnail}
                    width={remToPx(TEMPLATE_PREVIEW_WIDTH)}
                    height={remToPx(TEMPLATE_PREVIEW_WIDTH) * (9 / 16)}
                  />
                </Col>
              );
            })}

          {thumbnails.value.length === 0 && fetchedThumbnails && (
            <Col>
              <div className="flex flex-column justify-center items-center">
                <PiMaskSadLight size="5rem" />
                <h1 className="text-2xl font-bold text-center">
                  No thumbnails found
                </h1>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
}
