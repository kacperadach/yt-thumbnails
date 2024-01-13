import { CSSProperties } from "react";
import { Circle } from "../../lib/types";
import {
  formatBorder,
  formatBoxShadow,
  formatDropShadow,
} from "../../lib/utils";

interface CircleProps {
  circle: Circle;
}

export default function CircleComponent(props: CircleProps) {
  const { circle } = props;

  const circleStyles: CSSProperties = {
    border: formatBorder(circle.border, 1),
    outline: circle.outline && formatBorder(circle.outline, 1),
    backgroundColor: circle.backgroundColor,
    aspectRatio: "1/1",
    position: "absolute",
    borderRadius: "50%",
    width: "100%",
    height: "100%",
    filter:
      circle.dropShadow &&
      `drop-shadow(${formatDropShadow(circle.dropShadow)})`,
    boxShadow: circle.boxShadow && formatBoxShadow(circle.boxShadow),
  };

  return <div style={circleStyles} />;
}
