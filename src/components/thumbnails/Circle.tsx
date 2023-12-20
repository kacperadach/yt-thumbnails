import { CSSProperties } from "react";
import { Circle } from "../../lib/types";
import { formatBorder } from "../../lib/utils";

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
  };

  return (
    <div className="absolute rounded-full w-full h-full" style={circleStyles} />
  );
}
