import { useState, useEffect, useMemo } from "react";
import { Shape, ThumbnailAsset } from "../../lib/types";
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

interface EditMenuContainerProps {
  thumbnailAsset: ThumbnailAsset;
  onUpdate: (newFields: Object) => void;
}

export default function EditMenuContainer(props: EditMenuContainerProps) {
  const { thumbnailAsset, onUpdate } = props;

  console.log(thumbnailAsset);

  const [fieldFilter, setFieldFilter] = useState<string>("positioning");

  const filterFields = useMemo(() => {
    const fields: string[] = [];
    if (thumbnailAsset) {
      const typeKey =
        thumbnailAsset.type === "shape"
          ? (thumbnailAsset as Shape).shapeType
          : thumbnailAsset.type;

      if (FIELDS_BY_TYPE[typeKey as keyof typeof FIELDS_BY_TYPE]) {
        fields.push(
          ...(FIELDS_BY_TYPE[typeKey as keyof typeof FIELDS_BY_TYPE].find(
            (group) => group.type === fieldFilter
          )?.fields || [])
        );
      }
    }

    return fields;
  }, [thumbnailAsset, fieldFilter]);

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

  useEffect(() => {
    if (thumbnailAsset) {
      if (thumbnailAsset.type === "shape") {
        setFieldFilter((thumbnailAsset as Shape).shapeType);
      } else {
        setFieldFilter(thumbnailAsset.type);
      }
    }
  }, [thumbnailAsset?.id]);

  if (!defaultObject) {
    return null;
  }

  return (
    <div>
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
                    fieldFilter === group.type && "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (group.type === "shape") {
                      setFieldFilter((thumbnailAsset as Shape).shapeType);
                    } else {
                      setFieldFilter(group.type);
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
        filterFields={filterFields}
      />
    </div>
  );
}
