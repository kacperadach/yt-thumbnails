import BorderStyleField from "./BorderStyleField";
import { Image, ThumbnailAsset } from "../../lib/types";
import { images } from "../../lib/signals";
import FontSelect from "./FontSelect";
import ColorField from "./ColorField";

const STEP_SIZE_MAP = {
  fontWeight: 100,
  edgeRoundness: 0.01,
  cornerRadius: 5,
  blur: 0.5,
  brightness: 0.1,
  contrast: 10,
  grayscale: 5,
  hueRotate: 15,
  invert: 5,
  opacity: 5,
  saturate: 10,
  sepia: 5,
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
  const { asset, fieldName, onUpdate, value, defaultValue, type, disabled } =
    props;

  let { step } = props;

  if (STEP_SIZE_MAP[fieldName as keyof typeof STEP_SIZE_MAP]) {
    step = STEP_SIZE_MAP[fieldName as keyof typeof STEP_SIZE_MAP];
  }

  const inputType = typeof defaultValue;

  let emptyValue;
  if (fieldName === "edgeRoundness") {
    emptyValue = 1; // Remotion Triangle is weird
  } else if (inputType === "number") {
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
    return (
      <ColorField
        fieldName={fieldName}
        value={value}
        onUpdate={onUpdate}
        defaultValue={defaultValue}
      />
    );
  }

  if (fieldName.toLowerCase() === "style") {
    return (
      <BorderStyleField
        style={value}
        onChange={(style: string) => onUpdate({ [fieldName]: style })}
      />
    );
  }

  if (inputType === "boolean") {
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
  }

  if (fieldName === "fontFamily") {
    return (
      <FontSelect
        selectedFont={value}
        onUpdate={(font: string) => onUpdate({ [fieldName]: font })}
      />
    );
  }

  return (
    <input
      className={`w-full ml-2 border-2 border-gray-200 rounded-md p-1 ${
        disabled && "bg-gray-200 opacity-60"
      }`}
      type={inputType}
      name={fieldName}
      value={value !== undefined ? value : emptyValue}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disabled}
      step={step}
    />
  );
}
