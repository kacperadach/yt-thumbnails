import { RxBorderSolid, RxBorderDashed, RxBorderDotted } from "react-icons/rx";

interface BorderStyleFieldProps {
  style: string;
  onChange: (style: string) => void;
}

export default function BorderStyleField(props: BorderStyleFieldProps) {
  const { style, onChange } = props;

  return (
    <div className="flex">
      <div
        className={`border px-1 mr-2 cursor-pointer ${
          style === "solid" && "bg-gray-200"
        }`}
        onClick={() => onChange("solid")}
      >
        <RxBorderSolid size="1.5rem" />
      </div>
      <div
        className={`border px-1 mr-2 cursor-pointer ${
          style === "dashed" && "bg-gray-200"
        }`}
        onClick={() => onChange("dashed")}
      >
        <RxBorderDashed size="1.5rem" />
      </div>
      <div
        className={`border px-1 mr-2 cursor-pointer ${
          style === "dotted" && "bg-gray-200"
        }`}
        onClick={() => onChange("dotted")}
      >
        <RxBorderDotted size="1.5rem" />
      </div>
    </div>
  );
}
