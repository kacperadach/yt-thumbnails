import { thumbnail } from "../../lib/signals";
import { IoColorPaletteSharp } from "react-icons/io5";
import { FaFileImage, FaFileVideo } from "react-icons/fa";
import { RiVideoAddFill } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import EditField from "./EditField";
import { Col, Container, Row } from "react-bootstrap";
import { Arrow, Circle, Image, ThumbnailAsset } from "../../lib/types";

export default function BackgroundMenu() {
  const onUpdate = (newFields: Object) => {
    if (!thumbnail.value) {
      return;
    }

    thumbnail.value = {
      ...thumbnail.value,
      background: {
        ...thumbnail.value?.background,
        ...newFields,
      },
    };
  };

  return (
    <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
      <div>
        <h4 className="text-4xl font-bold my-1">Editing Background</h4>
      </div>
      <div>
        <div className="flex justify-center w-full cursor-pointer my-2">
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "color" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "color" })}
          >
            <IoColorPaletteSharp size="2rem" />
          </div>
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "image" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "image" })}
          >
            <BsCardImage size="2rem" />
          </div>
          <div
            className={`p-3 border mx-2 ${
              thumbnail.value?.background.type === "video" && "bg-gray-200"
            }`}
            onClick={() => onUpdate({ type: "video" })}
          >
            <RiVideoAddFill size="2rem" />
          </div>
        </div>
        <Container>
          {thumbnail.value?.background.type === "color" && (
            <Row className="flex my-1 items-center">
              <Col md={3}>
                <label className="font-bold mx-2 ">Color</label>
              </Col>
              <Col className="flex">
                <EditField
                  fieldName="color"
                  value={thumbnail.value?.background.color}
                  defaultValue="transparent"
                  onUpdate={onUpdate}
                />
              </Col>
            </Row>
          )}
          {thumbnail.value?.background.type === "image" && (
            <Row className="flex my-1 items-center">
              <Col md={3}>
                <label className="font-bold mx-2 ">Image Url</label>
              </Col>
              <Col className="flex">
                <EditField
                  fieldName="imageSrc"
                  value={thumbnail.value?.background.imageSrc}
                  defaultValue=""
                  onUpdate={onUpdate}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}
