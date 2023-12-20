import { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ThumbnailAsset } from "../../../lib/types";
import {
  capitalizeFirstLetter,
  getPixelScaleFactor,
  remToPx,
} from "../../../lib/utils";
import BaseAsset from "../../thumbnails/BaseAsset";
import { selectedAssetId, selectedMenu, thumbnail } from "../../../lib/signals";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdOutlineTextFields } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { BsPlus, BsTrash } from "react-icons/bs";

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
    <Row className="flex my-8 items-center">
      <Col md={3}>
        <div className="flex flex-column justify-center items-center border-2 border-black p-2">
          {ICON_MAP[asset.type as keyof typeof ICON_MAP]}
          <label className="font-bold mx-2 ">
            {capitalizeFirstLetter(asset.type)}
          </label>
        </div>
      </Col>
      <Col md={3}>
        <div
          className="relative"
          style={{
            height: `${PREVIEW_WIDTH_REM}rem`,
            width: `${remToPx(PREVIEW_WIDTH_REM) * (16 / 9)}px`,
          }}
          ref={previewDivRef}
        >
          <BaseAsset
            asset={asset}
            editable={false}
            pixelScaleFactor={getPixelScaleFactor(
              previewDivRef.current?.clientWidth || 0
            )}
          />
        </div>
      </Col>
      <Col md={3}>
        <button
          className="flex bg-gray-200 rounded justify-center items-center p-2 font-bold"
          onClick={() => {
            selectedAssetId.value = asset.id;
            selectedMenu.value = null;
          }}
        >
          <span>Edit</span>
          <BiSolidEditAlt size="2rem" />
        </button>
      </Col>
      <Col md={3}>
        <button
          className="flex bg-red-400 rounded justify-center items-center p-2 font-bold"
          onClick={() => {
            if (!thumbnail.value) {
              return;
            }

            thumbnail.value = {
              ...thumbnail.value,
              assets: thumbnail.value?.assets.filter((a) => a.id !== asset.id),
            };
          }}
        >
          <span>Delete</span>
          <BsTrash size="2rem" />
        </button>
      </Col>
    </Row>
  );
}
