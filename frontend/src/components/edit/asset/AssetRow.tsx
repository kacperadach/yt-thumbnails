import { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ThumbnailAsset } from "../../../lib/types";
import {
  capitalizeFirstLetter,
  getPixelScaleFactor,
  remToPx,
} from "../../../lib/utils";
import BaseAsset from "../../thumbnails/BaseAsset";
import {
  selectedAssetId,
  selectedMenu,
  thumbnail,
  thumbnails,
  editingThumbnailId,
} from "../../../lib/signals";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdOutlineTextFields } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { BsPlus, BsTrash } from "react-icons/bs";
import AssetPreview from "./AssetPreview";
import { Button, Text } from "@radix-ui/themes";

const PREVIEW_WIDTH_REM = 3;

const ICON_MAP = {
  text: <MdOutlineTextFields size="2rem" />,
  image: <BsCardImage size="2rem" />,
  shape: <FaShapes size="2rem" />,
};

interface AssetRowProps {
  asset: ThumbnailAsset;
}

export default function AssetRow(props: AssetRowProps) {
  const { asset } = props;

  const previewDivRef = useRef<HTMLDivElement>(null);

  return (
    <Row className="flex py-2 my-2 items-center hover:bg-gray-200">
      <Col md={2}>
        <div className="flex flex-column justify-center items-center border-2 border-black p-2">
          {ICON_MAP[asset.type as keyof typeof ICON_MAP]}
          <label className="font-bold mx-2 ">
            {capitalizeFirstLetter(asset.type)}
          </label>
        </div>
      </Col>
      <Col md={4}>
        <AssetPreview asset={asset} />
      </Col>
      <Col md={3} className="h-full">
        <Button
          className="flex rounded justify-center items-center p-12 font-bold"
          onClick={() => {
            selectedAssetId.value = asset.id;
            selectedMenu.value = null;
          }}
        >
          <Text>Edit</Text>
          <BiSolidEditAlt size="2rem" />
        </Button>
      </Col>
      <Col md={3}>
        <Button
          variant="outline"
          className="flex rounded justify-center items-center p-12 font-bold"
          onClick={() => {
            if (!thumbnail.value || !editingThumbnailId.value) {
              return;
            }

            thumbnails.value = thumbnails.value.map((t) => {
              if (t.id === editingThumbnailId.value) {
                return {
                  ...t,
                  assets: t.assets.filter((a) => a.id !== asset.id),
                };
              }
              return t;
            });
          }}
        >
          <Text>Delete</Text>
          <BsTrash size="2rem" />
        </Button>
      </Col>
    </Row>
  );
}
