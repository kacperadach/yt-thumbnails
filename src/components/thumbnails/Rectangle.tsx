import { CSSProperties } from "react";
import { Rectangle } from "../../lib/types";
import { formatBorder } from "../../lib/utils";

interface RectangleProps {
  rectangle: Rectangle;
}

export default function RectangleComponent(props: RectangleProps) {
  const { rectangle } = props;
  const rectangleStyles: CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: rectangle.backgroundColor,
    border: rectangle.border && formatBorder(rectangle.border, 1),
    borderRadius: `${rectangle.borderRadius}px`,
  };

  return <div style={rectangleStyles} />;
}
