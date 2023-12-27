import { useState } from "react";
import { SketchPicker } from "react-color";
import { BsCheck, BsPlus } from "react-icons/bs";
import BorderStyleField from "./BorderStyleField";
import { Image, Text, ThumbnailAsset } from "../../lib/types";
import { images, thumbnail } from "../../lib/signals";
import { Dropdown } from "react-bootstrap";
import { AVAILABLE_DEFAULT_FONTS } from "../../lib/constants";
import tinycolor from "tinycolor2";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import { getAllColorsFromThumbnail } from "../../lib/utils";

const STEP_SIZE_MAP = {
  fontWeight: 100,
};

interface EditFieldProps {
  asset?: ThumbnailAsset;
  fieldName: string;
  value: any;
  defaultValue: any;
  onUpdate: (value: any) => void;
  type?: string;
  disabled?: boolean;
  step?: number;
}

export default function EditField(props: EditFieldProps) {
  const [editingColor, setEditingColor] = useState(false);

  const { asset, fieldName, onUpdate, value, defaultValue, type, disabled } =
    props;

  let { step } = props;

  if (STEP_SIZE_MAP[fieldName as keyof typeof STEP_SIZE_MAP]) {
    step = STEP_SIZE_MAP[fieldName as keyof typeof STEP_SIZE_MAP];
  }

  const inputType = typeof defaultValue;

  let emptyValue;
  if (inputType === "number") {
    emptyValue = 0;
  } else if (inputType === "string") {
    emptyValue = "";
  } else if (inputType === "boolean") {
    emptyValue = false;
  }

  const handleChange = (value: any) => {
    let newValue = value;
    if (inputType === "number") {
      newValue = newValue ? parseFloat(newValue) : "";
    }

    const updatedFields = { [fieldName]: newValue };

    if (fieldName === "src") {
      updatedFields["imageId"] = undefined;
    }

    if (fieldName === "transparent" && asset?.type === "image") {
      const imageResource = images.value.find(
        (image) => image.id === (asset as Image).imageId
      );
      if (imageResource) {
        updatedFields["src"] = newValue
          ? imageResource.url_transparent
          : imageResource.url;
      }
    }

    onUpdate(updatedFields);
  };

  if (fieldName.toLowerCase().includes("color")) {
    if (!value) {
      return (
        <button
          className="w-md border-2 border-gray-200 hover:bg-gray-200"
          onClick={() => {
            setEditingColor(true);
            onUpdate({ [fieldName]: defaultValue });
          }}
        >
          <BsPlus size="1.5rem" />
        </button>
      );
    } else if (!editingColor) {
      return (
        <button
          className="w-md border-2 border-gray-200 hover:bg-gray-200"
          onClick={() => setEditingColor(true)}
        >
          <div
            style={{
              backgroundColor: value,
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
        </button>
      );
    }

    let presetColors: PresetColor[] = [];
    if (thumbnail.value) {
      presetColors = getAllColorsFromThumbnail(thumbnail.value);
    }

    return (
      <div className="flex items-center">
        <SketchPicker
          color={value}
          onChange={(color) => {
            const colorString = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            onUpdate({ [fieldName]: colorString });
          }}
          presetColors={presetColors}
        />
        <button
          className="w-md border-2 border-gray-200 hover:bg-green-300 mx-2"
          onClick={() => setEditingColor(false)}
        >
          <BsCheck size="1.5rem" />
        </button>
      </div>
    );
  } else if (fieldName.toLowerCase() === "style") {
    return (
      <BorderStyleField
        style={value}
        onChange={(style: string) => onUpdate({ [fieldName]: style })}
      />
    );
  } else if (inputType === "boolean") {
    return (
      <input
        className={`border-2 border-gray-200 rounded-md p-1 ${
          disabled && "bg-gray-200 opacity-60"
        }`}
        style={{ width: "fit-content" }}
        type="checkbox"
        name={fieldName}
        checked={value}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        disabled={disabled}
      />
    );
  } else if (fieldName === "fontFamily") {
    return (
      <Dropdown className="bg-white text-black">
        <Dropdown.Toggle className="bg-white text-black border border-2 rounded-md">
          {value}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {AVAILABLE_DEFAULT_FONTS.map((font, index) => {
            return (
              <Dropdown.Item
                key={index}
                onClick={() => onUpdate({ [fieldName]: font })}
                style={{
                  fontFamily: font,
                }}
              >
                {font}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  } else {
    return (
      <input
        className={`border-2 border-gray-200 rounded-md p-1 ${
          disabled && "bg-gray-200 opacity-60"
        }`}
        style={{ width: "fit-content" }}
        type={inputType}
        name={fieldName}
        value={value !== undefined ? value : emptyValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        step={step}
      />
    );
  }
}
