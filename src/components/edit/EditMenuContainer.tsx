import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { selectedAsset, thumbnail } from "../../lib/signals";
import { Thumbnail, ThumbnailAsset } from "../../lib/types";
import { capitalizeFirstLetter } from "../../lib/utils";
import EditField from "./EditField";
import { DEFAULT_TEXT_OBJECT } from "../../lib/constants";
import EditMenu from "./EditMenu";

const GROUPED_FIELDS = {
  "position": {}
}

export default function EditMenuContainer() {
  const thumbnailAsset = selectedAsset.value as ThumbnailAsset;

  const onUpdate = (newFields: Object) => {
    if (!thumbnail.value) {
      return;
    }

  

    thumbnail.value = {
      background: thumbnail.value.background,
      assets: thumbnail.value.assets.map((asset) => {
        if (asset.id === thumbnailAsset.id) {
          return {
            ...asset,
            ...newFields,
          };
        }
        return asset;
      }),
    };
  };

  let defaultObject: any = null;
  if (thumbnailAsset.type === "text") {
    defaultObject = DEFAULT_TEXT_OBJECT;
  }

  if (!defaultObject) {
    return null;
  }

  return (
    <Container className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
      <Row>
        <h4 className="text-4xl font-bold my-1">
          Editing {capitalizeFirstLetter(thumbnailAsset.type)}
        </h4>
      </Row>
      <div></div>
      <EditMenu
        defaultObject={defaultObject}
        onUpdate={onUpdate}
        asset={thumbnailAsset}
      />
      {/* <Container fluid>
        {Object.keys(defaultObject).map((key, index) => {
          if (IGNORED_FIELDS.includes(key)) {
            return null;
          }

          if (key === "border") {
            return null;
          }

          return (
            <EditField
              key={index}
              fieldName={key}
              value={thumbnailAsset[key as keyof ThumbnailAsset] as any}
              onUpdate={onUpdate}
              defaultValue={defaultObject[key as keyof ThumbnailAsset] as any}
            />
          );
        })}
      </Container> */}
    </Container>
  );
}
