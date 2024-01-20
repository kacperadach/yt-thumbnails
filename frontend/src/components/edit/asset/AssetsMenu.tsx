import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { BsPlus, BsTrash } from "react-icons/bs";
import {
  thumbnail,
  isCreatingAsset,
  selectedAssetId,
  selectedMenu,
  thumbnails,
} from "../../../lib/signals";
import { Container, Row, Col } from "react-bootstrap";
import AssetRow from "./AssetRow";
import { signal } from "@preact/signals-react";
import { MdOutlineTextFields } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { capitalizeFirstLetter, getPixelScaleFactor } from "../../../lib/utils";
import EditField from "../EditField";
import {
  AIImageResource,
  Arrow,
  Circle,
  Image,
  ImageResource,
  Text,
} from "../../../lib/types";
import {
  DEFAULT_TEXT_OBJECT,
  DEFAULT_IMAGE_OBJECT,
  DEFAULT_CIRCLE_OBJECT,
  DEFAULT_ARROW_OBJECT,
  DEFAULT_RECTANGLE_OBJECT,
  DEFAULT_TRIANGLE_OBJECT,
} from "../../../lib/constants";
import { FiCircle } from "react-icons/fi";
import { RiArrowLeftUpFill } from "react-icons/ri";
import { PiRectangleLight } from "react-icons/pi";
import { FiTriangle } from "react-icons/fi";
import UploadedImageGallery from "../image/UploadedImageGallery";
import { TEXT_STYLES } from "../../../lib/text/textStyles";
import TextAsset from "../../thumbnails/Text";
import AssetPreview from "./AssetPreview";

export default function AssetsMenu() {
  const [showShapeChoices, setShowShapeChoices] = useState(false);
  const [showImageChoices, setShowImageChoices] = useState(false);
  const [showTextChoices, setShowTextChoices] = useState(false);

  const addAsset = (defaultObject: any) => {
    const id = uuidv4();
    isCreatingAsset.value = false;

    thumbnails.value = thumbnails.value.map((t) => {
      if (t.id !== thumbnail.value?.id) {
        return t;
      }

      return {
        ...t,
        assets: [
          ...t.assets,
          {
            ...defaultObject,
            id,
            zIndex:
              thumbnail.value?.assets.reduce((max, obj) => {
                return Math.max(max, obj.zIndex);
              }, 0) + 1 || 0,
          },
        ],
      };
    });

    selectedMenu.value = null;
    selectedAssetId.value = id;
  };

  return (
    <div>
      <div>
        <h4 className="text-4xl font-bold my-1 justify-center text-center">
          {isCreatingAsset.value ? "Add New Asset" : "Assets"}
        </h4>
      </div>
      <div>
        <div className="flex justify-center w-full cursor-pointer my-2">
          {!isCreatingAsset.value && (
            <div
              className="p-3 border mx-2 hover:bg-gray-200"
              onClick={() => (isCreatingAsset.value = true)}
            >
              <BsPlus size="2rem" />
            </div>
          )}
          {isCreatingAsset.value && (
            <Row className="flex w-full justify-center">
              <Col
                md={3}
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer`}
                onClick={() => {
                  setShowTextChoices(true);
                }}
              >
                <MdOutlineTextFields size="2rem" />
                <label className="font-bold mx-2 ">Text</label>
              </Col>
              <Col
                md={3}
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer `}
                onClick={() => {
                  setShowImageChoices(true);
                }}
              >
                <BsCardImage size="2rem" />
                <label className="font-bold mx-2 ">Image</label>
              </Col>
              <Col
                md={3}
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  showShapeChoices && "bg-gray-200"
                }`}
                onClick={() => setShowShapeChoices(true)}
              >
                <FaShapes size="2rem" />
                <label className="font-bold mx-2 ">Shape</label>
              </Col>
            </Row>
          )}
        </div>

        {showShapeChoices && (
          <Row className="flex justify-center w-full">
            <Col
              md={3}
              className={`p-3 m-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer`}
              onClick={() => {
                addAsset(DEFAULT_CIRCLE_OBJECT);
              }}
            >
              <FiCircle size="2rem" />
              <label className="font-bold mx-2 ">Circle</label>
            </Col>
            <Col
              md={3}
              className={`p-3 m-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer`}
              onClick={() => {
                addAsset(DEFAULT_ARROW_OBJECT);
              }}
            >
              <RiArrowLeftUpFill size="2rem" />
              <label className="font-bold mx-2 ">Arrow</label>
            </Col>
            <Col
              md={3}
              className={`p-3 m-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer`}
              onClick={() => {
                addAsset(DEFAULT_RECTANGLE_OBJECT);
              }}
            >
              <PiRectangleLight size="2rem" />
              <label className="font-bold mx-2 ">Rectangle</label>
            </Col>
            <Col
              md={3}
              className={`p-3 m-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer`}
              onClick={() => {
                addAsset(DEFAULT_TRIANGLE_OBJECT);
              }}
            >
              <FiTriangle size="2rem" />
              <label className="font-bold mx-2 ">Triangle</label>
            </Col>
          </Row>
        )}
        {showImageChoices && (
          <UploadedImageGallery
            handleSelect={(
              image: AIImageResource | ImageResource,
              imageType: "upload" | "ai"
            ) => {
              addAsset({
                ...DEFAULT_IMAGE_OBJECT,
                src: image.url,
                imageId: image.id,
                imageType,
              });
            }}
            onBackClick={() => setShowImageChoices(false)}
          />
        )}

        {showTextChoices && (
          <Row>
            {TEXT_STYLES.map((text, index) => {
              return (
                <Col md={12} key={index}>
                  <div
                    className="relative hover:bg-gray-200 cursor-pointer rounded"
                    style={{ height: `${text.height}px` }}
                    onClick={() => addAsset(text)}
                  >
                    <AssetPreview asset={text} />
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        {!isCreatingAsset.value && (
          <Container>
            {thumbnail.value?.assets.map((asset, index) => {
              return <AssetRow key={index} asset={asset} />;
            })}
          </Container>
        )}
      </div>
    </div>
  );
}
