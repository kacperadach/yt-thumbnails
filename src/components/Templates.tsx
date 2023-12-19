import { Container, Row, Col } from "react-bootstrap";
import { Thumbnail } from "../lib/types";
import ThumbnailPreview from "./thumbnails/ThumbnailComposition";
import { pxToRem, remToPx } from "../lib/utils";
import { staticFile } from "remotion";
import { TEMPLATES, TEMPLATE_PREVIEW_WIDTH } from "../lib/constants";
import { thumbnail } from "../lib/signals";

export default function Templates() {
  console.log(thumbnail.value);
  return (
    <Container fluid>
      <div className="">
        <div>
          <div className="text-xl font-medium text-black">Templates</div>
          <Row className="flex">
            {TEMPLATES.map((template, index) => {
              return (
                <Col
                  key={index}
                  md={2}
                  className="p-6 max-w-sm mx-10  rounded-xl shadow-lg flex items-center hover:bg-blue-300 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => {
                    thumbnail.value = template;
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
      </div>
    </Container>
  );
}
