import { Container, Row, Col } from "react-bootstrap";
import { Thumbnail } from "../lib/types";
import ThumbnailPreview from "./thumbnails/ThumbnailComposition";
import { pxToRem, remToPx } from "../lib/utils";
import { staticFile } from "remotion";
import { TEMPLATES, TEMPLATE_PREVIEW_WIDTH } from "../lib/constants";
import { thumbnails, editingThumbnailId } from "../lib/signals";
import { createThumbnail } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Templates() {
  const navigate = useNavigate();

  const onTemplateSelect = async (template: Thumbnail) => {
    const response = await createThumbnail(template);
    if (response.success) {
      const newThumbnail = response.data as Thumbnail;
      thumbnails.value = [...thumbnails.value, newThumbnail];
      editingThumbnailId.value = newThumbnail.id;
      navigate(`/edit/${newThumbnail.id}`);
    }
  };

  return (
    <Container fluid>
      <div>
        {/* <div className="text-xl font-medium text-black">Templates</div> */}
        <Row className="flex">
          {TEMPLATES.map((template, index) => {
            return (
              <Col
                key={index}
                md={2}
                className="px-6 max-w-sm mx-8 my-2 rounded-xl shadow-lg flex items-center hover:bg-brand-green transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  onTemplateSelect(template);
                }}
              >
                <ThumbnailPreview
                  thumbnail={template}
                  width={remToPx(TEMPLATE_PREVIEW_WIDTH)}
                  height={remToPx(TEMPLATE_PREVIEW_WIDTH) * (9 / 16)}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
}
