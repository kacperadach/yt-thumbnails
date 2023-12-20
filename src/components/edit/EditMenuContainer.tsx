import { Container, Row } from "react-bootstrap";
import { selectedAsset, thumbnail } from "../../lib/signals";
import { Shape, Thumbnail, ThumbnailAsset } from "../../lib/types";
import { capitalizeFirstLetter } from "../../lib/utils";
import {
  DEFAULT_TEXT_OBJECT,
  DEFAULT_IMAGE_OBJECT,
  DEFAULT_CIRCLE_OBJECT,
} from "../../lib/constants";
import EditMenu from "./EditMenu";
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { MdOutlineTextFields } from "react-icons/md";
import { RxBorderAll, RxImage } from "react-icons/rx";
import { BsCardImage } from "react-icons/bs";
import { FiCircle } from "react-icons/fi";
import { useSignalEffect, signal, computed } from "@preact/signals-react";

const POSITIONING_GROUP = {
  icon: <FaArrowsUpDownLeftRight size="2rem" />,
  type: "positioning",
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
};

const FIELDS_BY_TYPE = {
  circle: [
    {
      icon: <FiCircle size="2rem" />,
      type: "circle",
      fields: ["border", "outline", "backgroundColor"],
    },
    POSITIONING_GROUP,
  ],
  image: [
    {
      icon: <BsCardImage size="2rem" />,
      type: "image",
      fields: ["src"],
    },
    POSITIONING_GROUP,
  ],
  text: [
    {
      icon: <MdOutlineTextFields size="2rem" />,
      type: "text",
      fields: [
        "text",
        "color",
        "fontFamily",
        "fontSize",
        "fontWeight",
        "backgroundColor",
        "padding",
      ],
    },
    POSITIONING_GROUP,
    {
      icon: <RxBorderAll size="2rem" />,
      type: "border",
      fields: [
        "borderRadius",
        "border",
        "borderLeft",
        "borderRight",
        "borderTop",
        "borderBottom",
        "longShadow",
      ],
    },
  ],
};

const fieldFilter = signal("positioning");

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

  const filterFields = computed(() => {
    const fields: string[] = [];
    if (thumbnailAsset) {
      const typeKey =
        thumbnailAsset.type === "shape"
          ? (thumbnailAsset as Shape).shapeType
          : thumbnailAsset.type;

      if (FIELDS_BY_TYPE[typeKey as keyof typeof FIELDS_BY_TYPE]) {
        fields.push(
          ...(FIELDS_BY_TYPE[typeKey as keyof typeof FIELDS_BY_TYPE].find(
            (group) => group.type === fieldFilter.value
          )?.fields || [])
        );
      }
    }

    return fields;
  });

  let defaultObject: any = null;
  if (thumbnailAsset.type === "text") {
    defaultObject = DEFAULT_TEXT_OBJECT;
  } else if (thumbnailAsset.type === "image") {
    defaultObject = DEFAULT_IMAGE_OBJECT;
  } else if (thumbnailAsset.type === "shape") {
    if ((thumbnailAsset as Shape).shapeType === "circle") {
      defaultObject = DEFAULT_CIRCLE_OBJECT;
    }
  }

  useSignalEffect(() => {
    if (selectedAsset.value) {
      if (selectedAsset.value.type === "shape") {
        fieldFilter.value = (selectedAsset.value as Shape).shapeType;
      } else {
        fieldFilter.value = selectedAsset.value.type;
      }
    }
  });

  if (!defaultObject) {
    return null;
  }

  return (
    <div className="p-6 mx-10 bg-white rounded-xl shadow-lg items-center">
      <div>
        <h4 className="text-4xl font-bold my-1">
          Editing {capitalizeFirstLetter(thumbnailAsset.type)}
        </h4>
      </div>
      <div>
        <div className="flex justify-center w-full cursor-pointer my-2">
          {FIELDS_BY_TYPE[
            (thumbnailAsset.type === "shape"
              ? (thumbnailAsset as Shape).shapeType
              : thumbnailAsset.type) as keyof typeof FIELDS_BY_TYPE
          ].map((group, index) => {
            if (
              group.fields.some((field) => defaultObject[field] !== undefined)
            ) {
              return (
                <div
                  key={index}
                  className={`p-3 border mx-2 ${
                    fieldFilter.value === group.type && "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (group.type === "shape") {
                      fieldFilter.value = (thumbnailAsset as Shape).shapeType;
                    } else {
                      fieldFilter.value = group.type;
                    }
                  }}
                >
                  {group.icon}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      <EditMenu
        defaultObject={defaultObject}
        onUpdate={onUpdate}
        asset={thumbnailAsset}
        filterFields={filterFields.value}
      />
    </div>
  );
}
