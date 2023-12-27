import { CSSProperties } from "react";
import { Triangle } from "../../lib/types";
import { formatBorder } from "../../lib/utils";

interface TriangleProps {
  triangle: Triangle;
}

export default function TriangleComponent(props: TriangleProps) {
  const { triangle } = props;

  // Define the points of the triangle
  const points = `0,${triangle.height} ${triangle.width / 2},0 ${
    triangle.width
  },${triangle.height}`;

  return (
    <svg height={triangle.height} width={triangle.width}>
      <polygon points={points} fill={triangle.backgroundColor} />
    </svg>
  );
}
