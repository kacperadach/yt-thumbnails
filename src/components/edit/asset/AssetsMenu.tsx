import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { BsPlus, BsTrash } from "react-icons/bs";
import {
  creatingAsset,
  thumbnail,
  isCreatingAsset,
} from "../../../lib/signals";
import { Container, Row, Col } from "react-bootstrap";
import AssetRow from "./AssetRow";
import { signal } from "@preact/signals-react";
import { MdOutlineTextFields } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../../lib/utils";
import EditField from "../EditField";
import { Arrow, Circle, Image, Text } from "../../../lib/types";
import {
  DEFAULT_TEXT_OBJECT,
  DEFAULT_IMAGE_OBJECT,
  DEFAULT_CIRCLE_OBJECT,
} from "../../../lib/constants";
import CreateTextAsset from "./CreateAsset";
import CreateAsset from "./CreateAsset";

export default function AssetsMenu() {
  console.log(creatingAsset.value);

  return (
    <div>
      <div>
        <h4 className="text-4xl font-bold my-1">
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
            <>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  creatingAsset.value?.type === "text" && "bg-gray-200"
                }`}
                onClick={() =>
                  (creatingAsset.value = {
                    ...DEFAULT_TEXT_OBJECT,
                    id: uuidv4(),
                  })
                }
              >
                <MdOutlineTextFields size="2rem" />
                <label className="font-bold mx-2 ">Text</label>
              </div>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  creatingAsset.value?.type === "image" && "bg-gray-200"
                }`}
                onClick={() =>
                  (creatingAsset.value = {
                    ...DEFAULT_IMAGE_OBJECT,
                    id: uuidv4(),
                  })
                }
              >
                <BsCardImage size="2rem" />
                <label className="font-bold mx-2 ">Image</label>
              </div>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  creatingAsset.value?.type === "shape" && "bg-gray-200"
                }`}
                onClick={() => (creatingAsset.value = null)}
              >
                <FaShapes size="2rem" />
                <label className="font-bold mx-2 ">Shape</label>
              </div>
            </>
          )}
        </div>
        {creatingAsset.value && <CreateAsset />}

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
