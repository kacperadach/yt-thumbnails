import { Triangle } from "../../lib/types";
import { Triangle as RemotionTriangle } from "@remotion/shapes";

interface TriangleProps {
  triangle: Triangle;
}

export default function TriangleComponent(props: TriangleProps) {
  const { triangle } = props;

  let cornerRadius;
  let edgeRoundness;

  if (triangle.cornerRadius) {
    cornerRadius = triangle.cornerRadius;
  } else if (triangle.edgeRoundness !== 1) {
    edgeRoundness = triangle.edgeRoundness;
  }

  return (
    <RemotionTriangle
      length={Math.min(triangle.width, triangle.height || 0)}
      direction="up"
      fill={triangle.color}
      stroke={triangle.triangleBorder?.color || "transparent"}
      strokeWidth={triangle.triangleBorder?.width || 0}
      cornerRadius={cornerRadius}
      edgeRoundness={edgeRoundness}
    />
  );
}
