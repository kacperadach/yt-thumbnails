import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { capitalizeFirstLetter, addSpaceBeforeCaps } from "../../lib/utils";
import { SketchPicker, Color } from "react-color";
import { BsCheck, BsPlus } from "react-icons/bs";
import BorderStyleField from "./BorderStyleField";

interface EditFieldProps {
  fieldName: string;
  value: any;
  defaultValue: any;
  onUpdate: (value: any) => void;
  type?: string;
}

export default function EditField(props: EditFieldProps) {
  const [editingColor, setEditingColor] = useState(false);

  const { fieldName, onUpdate, value, defaultValue, type } = props;

  const inputType = typeof defaultValue;

  const handleChange = (e: any) => {
    let newValue = e.target.value;
    if (inputType === "number") {
      newValue = newValue ? parseFloat(newValue) : "";
    }
    onUpdate({ [fieldName]: newValue });
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

    return (
      <div className="flex items-center">
        <SketchPicker
          color={value}
          onChange={(color) => onUpdate({ [fieldName]: color.hex })}
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
  } else {
    return (
      <input
        className="border-2 border-gray-200 rounded-md p-1"
        style={{ width: "fit-content" }}
        type={typeof value}
        name={fieldName}
        value={value}
        onChange={handleChange}
      />
    );
  }
}
