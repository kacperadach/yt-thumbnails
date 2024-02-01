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
import { Flex, Tooltip } from "@radix-ui/themes";
import FontSelect from "../FontSelect";

export default function AssetsMenu() {
  const fontUsed = thumbnail.value?.assets
    .filter((a) => a.type === "text")
    .map((a) => (a as Text).fontFamily)
    .find((a) => a !== undefined);

  const [previewFont, setPreviewFont] = useState(fontUsed || "Arial");
  const [choices, setChoices] = useState<"text" | "image" | "shape" | null>(
    null
  );

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
            <Tooltip content="Add New Asset" dir="top">
              <div
                className="p-3 border mx-2 hover:bg-gray-200"
                onClick={() => (isCreatingAsset.value = true)}
              >
                <BsPlus size="2rem" />
              </div>
            </Tooltip>
          )}
          {isCreatingAsset.value && (
            <Row className="flex w-full justify-center flex">
              <Flex
                style={{ width: "fit-content", minWidth: "6rem" }}
                className={`border p-3 m-2 hover:bg-gray-200 cursor-pointer ${
                  choices === "text" && "bg-gray-200"
                }`}
                direction="column"
                justify="center"
                align="center"
                onClick={() => {
                  setChoices("text");
                }}
              >
                <MdOutlineTextFields size="2rem" />
                <label className="font-bold mx-2 ">Text</label>
              </Flex>
              <Flex
                style={{ width: "fit-content", minWidth: "6rem" }}
                className={`border p-3 m-2 hover:bg-gray-200 cursor-pointer ${
                  choices === "image" && "bg-gray-200"
                }`}
                direction="column"
                justify="center"
                align="center"
                onClick={() => {
                  setChoices("image");
                }}
              >
                <BsCardImage size="2rem" />
                <label className="font-bold mx-2 ">Image</label>
              </Flex>
              <Flex
                style={{ width: "fit-content", minWidth: "6rem" }}
                className={`border p-3 m-2 hover:bg-gray-200 cursor-pointer ${
                  choices === "shape" && "bg-gray-200"
                }`}
                direction="column"
                justify="center"
                align="center"
                onClick={() => setChoices("shape")}
              >
                <FaShapes size="2rem" />
                <label className="font-bold mx-2 ">Shape</label>
              </Flex>
            </Row>
          )}
        </div>

        {choices === "shape" && (
          <Row className="flex justify-center w-full">
            <Col
              md={12}
              className="flex justify-center hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => {
                addAsset(DEFAULT_CIRCLE_OBJECT);
              }}
            >
              <Flex
                style={{ minWidth: "7rem" }}
                className="p-3 m-2"
                direction="column"
                justify="center"
                align="center"
              >
                <FiCircle size="2rem" />
                <label className="font-bold mx-2">Circle</label>
              </Flex>
            </Col>
            <Col
              md={12}
              className="flex justify-center hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => {
                addAsset(DEFAULT_ARROW_OBJECT);
              }}
            >
              <Flex
                style={{ minWidth: "7rem" }}
                className="p-3 m-2"
                direction="column"
                justify="center"
                align="center"
              >
                <RiArrowLeftUpFill size="2rem" />
                <label className="font-bold mx-2 ">Arrow</label>
              </Flex>
            </Col>
            <Col
              md={12}
              className="flex justify-center hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => {
                addAsset(DEFAULT_RECTANGLE_OBJECT);
              }}
            >
              <Flex
                style={{ minWidth: "7rem" }}
                className="p-3 m-2"
                direction="column"
                justify="center"
                align="center"
              >
                <PiRectangleLight size="2rem" />
                <label className="font-bold mx-2 ">Rectangle</label>
              </Flex>
            </Col>
            <Col
              md={12}
              className="flex justify-center hover:bg-gray-200 cursor-pointer rounded"
              onClick={() => {
                addAsset(DEFAULT_TRIANGLE_OBJECT);
              }}
            >
              <Flex
                style={{ minWidth: "7rem" }}
                className="p-3 m-2"
                direction="column"
                justify="center"
                align="center"
              >
                <FiTriangle size="2rem" />
                <label className="font-bold mx-2 ">Triangle</label>
              </Flex>
            </Col>
          </Row>
        )}
        {choices === "image" && (
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
            onBackClick={() => setChoices(null)}
          />
        )}

        {choices === "text" && (
          <>
            <Row>
              <Col md={12}>
                <Flex align="center">
                  <label className="font-medium mr-2">Preview Font</label>
                  <FontSelect
                    selectedFont={previewFont}
                    onUpdate={(font: string) => setPreviewFont(font)}
                  />
                </Flex>
              </Col>
            </Row>
            <Row>
              {TEXT_STYLES.map((text, index) => {
                const textCopy = { ...text, fontFamily: previewFont };

                return (
                  <Col md={12} key={index}>
                    <div
                      className="relative hover:bg-gray-200 cursor-pointer rounded"
                      style={{ height: "5rem" }}
                      onClick={() => {
                        addAsset(textCopy);
                      }}
                    >
                      <AssetPreview asset={textCopy} />
                    </div>
                  </Col>
                );
              })}
            </Row>
          </>
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
