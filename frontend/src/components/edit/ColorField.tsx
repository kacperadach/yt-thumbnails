import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import { getAllColorsFromThumbnail } from "../../lib/utils";
import { thumbnail } from "../../lib/signals";
import ColorPicker from "react-best-gradient-color-picker";
import { BsCheck, BsPlus } from "react-icons/bs";
import { useState } from "react";
import { IconButton } from "@radix-ui/themes";

interface ColorFieldProps {
  fieldName: string;
  value: string;
  onUpdate: (value: any) => void;
  defaultValue: string;
}

export default function ColorField(props: ColorFieldProps) {
  const { fieldName, value, onUpdate, defaultValue } = props;

  const [editingColor, setEditingColor] = useState(false);

  if (!value) {
    return (
      <IconButton
        variant="outline"
        className="w-md border-2 hover:bg-gray-200"
        onClick={() => {
          setEditingColor(true);
          onUpdate({ [fieldName]: defaultValue });
        }}
      >
        <BsPlus size="1.5rem" />
      </IconButton>
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
            backgroundImage: value,
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
    <div className="flex items-center w-full">
      <ColorPicker
        className=""
        value={value}
        onChange={(color: { rgb: { r: any; g: any; b: any; a: any } }) => {
          console.log(color);
          onUpdate({ [fieldName]: color });
        }}
        presets={presetColors}
      />
      <IconButton
        className="w-md border-2 mx-2"
        onClick={() => setEditingColor(false)}
      >
        <BsCheck size="1.5rem" />
      </IconButton>
    </div>
  );
}
