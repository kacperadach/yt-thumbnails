import { CSSProperties } from "react";
import { Circle } from "../../lib/types";
import { formatBorder, getBaseCssProperties } from "../../lib/utils";

interface CircleProps {
  circle: Circle;
  pixelScaleFactor: number;
}

export default function CircleComponent(props: CircleProps) {
  const { circle, pixelScaleFactor } = props;

  const circleStyles: CSSProperties = {
    ...getBaseCssProperties(circle),
    border: formatBorder(circle.border, pixelScaleFactor),
    outline: circle.outline && formatBorder(circle.outline, pixelScaleFactor),
    backgroundColor: circle.backgroundColor,
    aspectRatio: "1/1",
  };

  return <div className="absolute rounded-full" style={circleStyles} />;
}
