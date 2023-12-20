import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { thumbnail } from "../../lib/signals";
import { Container } from "react-bootstrap";
import AssetRow from "./AssetRow";
import { signal } from "@preact/signals-react";
import { MdOutlineTextFields } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../lib/utils";

export default function AssetsMenu() {
  const [creatingAsset, setCreatingAsset] = useState(false);
  const [assetType, setAssetType] = useState<"text" | "image" | "shape" | null>(
    null
  );

  return (
    <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
      <div>
        <h4 className="text-4xl font-bold my-1">
          {creatingAsset ? "Add New Asset" : "Assets"}
        </h4>
      </div>
      <div>
        <div className="flex justify-center w-full cursor-pointer my-2">
          {!creatingAsset && (
            <div
              className="p-3 border mx-2 hover:bg-gray-200"
              onClick={() => setCreatingAsset(true)}
            >
              <BsPlus size="2rem" />
            </div>
          )}
          {creatingAsset && (
            <>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  assetType === "text" && "bg-gray-200"
                }`}
                onClick={() => setAssetType("text")}
              >
                <MdOutlineTextFields size="2rem" />
                <label className="font-bold mx-2 ">Text</label>
              </div>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  assetType === "image" && "bg-gray-200"
                }`}
                onClick={() => setAssetType("image")}
              >
                <BsCardImage size="2rem" />
                <label className="font-bold mx-2 ">Image</label>
              </div>
              <div
                className={`p-3 mx-2 flex flex-column justify-center items-center border p-2 hover:bg-gray-200 cursor-pointer ${
                  assetType === "shape" && "bg-gray-200"
                }`}
                onClick={() => setAssetType("shape")}
              >
                <FaShapes size="2rem" />
                <label className="font-bold mx-2 ">Shape</label>
              </div>
            </>
          )}
        </div>

        {!creatingAsset && (
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
