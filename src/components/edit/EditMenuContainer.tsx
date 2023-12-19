import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { selectedAsset, thumbnail } from "../../lib/signals";
import { Thumbnail, ThumbnailAsset } from "../../lib/types";
import { capitalizeFirstLetter } from "../../lib/utils";
import EditField from "./EditField";
import { DEFAULT_TEXT_OBJECT } from "../../lib/constants";
import EditMenu from "./EditMenu";
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { MdOutlineTextFields } from "react-icons/md";
import { RxBorderAll } from "react-icons/rx";

const GROUPED_FIELDS = {
  text: {
    fields: [
      "text",
      "color",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "backgroundColor",
      "padding",
    ],
    icon: <MdOutlineTextFields size="2rem" />,
  },
  position: {
    fields: [
      "top",
      "bottom",
      "left",
      "right",
      "width",
      "height",
      "zIndex",
      "rotation",
    ],
    icon: <FaArrowsUpDownLeftRight size="2rem" />,
  },

  border: {
    fields: [
      "borderRadius",
      "border",
      "borderLeft",
      "borderRight",
      "borderTop",
      "borderBottom",
      "longShadow",
    ],
    icon: <RxBorderAll size="2rem" />,
  },
};

export default function EditMenuContainer() {
  const thumbnailAsset = selectedAsset.value as ThumbnailAsset;

  const [fieldFilter, setFieldFilter] = useState(
    selectedAsset.value?.type || "position"
  );

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
    <Container
      fluid
      className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center"
    >
      <Row>
        <h4 className="text-4xl font-bold my-1">
          Editing {capitalizeFirstLetter(thumbnailAsset.type)}
        </h4>
      </Row>
      <Row>
        <div className="flex justify-center w-full cursor-pointer my-2">
          {Object.entries(GROUPED_FIELDS).map(
            ([groupName, fieldsAndIcon], index) => {
              return (
                <div
                  key={index}
                  className={`p-3 border mx-2 ${
                    fieldFilter === groupName && "bg-gray-200"
                  }`}
                  onClick={() => setFieldFilter(groupName)}
                >
                  {fieldsAndIcon.icon}
                </div>
              );
            }
          )}
        </div>
      </Row>

      <EditMenu
        defaultObject={defaultObject}
        onUpdate={onUpdate}
        asset={thumbnailAsset}
        filterFields={
          GROUPED_FIELDS[fieldFilter as keyof typeof GROUPED_FIELDS]?.fields ||
          []
        }
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
