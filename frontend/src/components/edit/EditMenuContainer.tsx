import { useState, useEffect, useMemo } from "react";
import { Image, ImageResource, Shape, ThumbnailAsset } from "../../lib/types";
import { capitalizeFirstLetter } from "../../lib/utils";
import {
  DEFAULT_TEXT_OBJECT,
  DEFAULT_IMAGE_OBJECT,
  DEFAULT_CIRCLE_OBJECT,
  DEFAULT_ARROW_OBJECT,
  DEFAULT_RECTANGLE_OBJECT,
  DEFAULT_TRIANGLE_OBJECT,
} from "../../lib/constants";
import EditMenu from "./EditMenu";
import { FaArrowsUpDownLeftRight } from "react-icons/fa6";
import { MdOutlineTextFields } from "react-icons/md";
import { RxBorderAll, RxImage } from "react-icons/rx";
import { BsCardImage, BsTrash } from "react-icons/bs";
import { FiCircle } from "react-icons/fi";
import UploadedImageGallery from "./image/UploadedImageGallery";
import { RiArrowLeftUpFill } from "react-icons/ri";
import { PiRectangleLight } from "react-icons/pi";
import { FiTriangle } from "react-icons/fi";
import ImageMenu from "./image/ImageMenu";

const POSITIONING_GROUP = {
  icon: <FaArrowsUpDownLeftRight size="2rem" />,
  type: "positioning",
  fields: ["x", "y", "width", "height", "zIndex", "rotation"],
};

const FIELDS_BY_TYPE = {
  triangle: [
    {
      icon: <FiTriangle size="2rem" />,
      type: "triangle",
      fields: ["width", "height", "backgroundColor"],
    },
    POSITIONING_GROUP,
  ],
  rectangle: [
    {
      icon: <PiRectangleLight size="2rem" />,
      type: "rectangle",
      fields: ["width", "height", "backgroundColor"],
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
        "dropShadow",
      ],
    },
  ],
  arrow: [
    {
      icon: <RiArrowLeftUpFill size="2rem" />,
      type: "arrow",
      fields: [
        "headWidth",
        "headHeight",
        "tailWidth",
        "color",
        "headColor",
        "tailColor",
        "dropShadow",
      ],
    },
    POSITIONING_GROUP,
  ],
  circle: [
    {
      icon: <FiCircle size="2rem" />,
      type: "circle",
      fields: [
        "width",
        "border",
        "outline",
        "backgroundColor",
        "dropShadow",
        "boxShadow",
      ],
    },
    POSITIONING_GROUP,
  ],
  image: [
    {
      icon: <BsCardImage size="2rem" />,
      type: "image",
      fields: ["src", "transparent", "dropShadow"],
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
        "textShadow",
      ],
    },
  ],
};

interface EditMenuContainerProps {
  thumbnailAsset: ThumbnailAsset;
  onUpdate: (newFields: Object) => void;
  handleDelete?: () => void;
}

export default function EditMenuContainer(props: EditMenuContainerProps) {
  const { thumbnailAsset, onUpdate, handleDelete } = props;

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
    const shape = thumbnailAsset as Shape;

    if (shape.shapeType === "circle") {
      defaultObject = DEFAULT_CIRCLE_OBJECT;
    } else if (shape.shapeType === "arrow") {
      defaultObject = DEFAULT_ARROW_OBJECT;
    } else if (shape.shapeType === "rectangle") {
      defaultObject = DEFAULT_RECTANGLE_OBJECT;
    } else if (shape.shapeType === "triangle") {
      defaultObject = DEFAULT_TRIANGLE_OBJECT;
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
          {handleDelete && (
            <div
              className={`p-3 border mx-2 bg-red-200`}
              onClick={() => {
                if (handleDelete) {
                  handleDelete();
                }
              }}
            >
              <BsTrash size="2rem" />
            </div>
          )}
        </div>
      </div>

      {fieldFilter !== "image" && (
        <EditMenu
          defaultObject={defaultObject}
          onUpdate={onUpdate}
          asset={thumbnailAsset}
          filterFields={filterFields}
        />
      )}

      {fieldFilter === "image" && (
        <ImageMenu
          selectedImageId={(thumbnailAsset as Image)?.imageId || ""}
          transparent={(thumbnailAsset as Image).transparent || false}
          x={(thumbnailAsset as Image).x || 50}
          y={(thumbnailAsset as Image).y || 50}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
