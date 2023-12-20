import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { thumbnail } from "../../lib/signals";
import { Container } from "react-bootstrap";
import AssetRow from "./AssetRow";
import { signal } from "@preact/signals-react";

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
        {!creatingAsset && (
          <div className="flex justify-center w-full cursor-pointer my-2">
            <div className="p-3 border mx-2 hover:bg-gray-200">
              <BsPlus size="2rem" onClick={() => setCreatingAsset(true)} />
            </div>
          </div>
        )}
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
