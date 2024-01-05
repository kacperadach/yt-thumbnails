import { EDITOR_HEIGHT, EDITOR_WIDTH } from "../../lib/constants";
import { Arrow } from "../../lib/types";

type ArrowHeadType = "triangle" | "line";

interface SvgArrowProps {
  arrow: Arrow;
}

export default function SvgArrow(props: SvgArrowProps) {
  // Define the path for the cubic Bezier curve

  const start = { x: 10, y: 0 };
  const middle = { x: 50, y: 50 };
  const end = { x: 90, y: 200 };

  const pathData = `M${start.x},${start.y} Q${middle.x},${middle.y} ${end.x},${end.y}`;

  return (
    <svg
      style={{
        overflow: "visible",
        strokeWidth: 5,
        
      }}
    >
      {/* Define the arrowhead marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="20"
          markerHeight="10"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>

      {/* Path using the arrowhead marker */}
      <path
        d={pathData}
        fill="none"
        stroke="black"
        markerEnd="url(#arrowhead)"
        style={{ strokeWidth: 9 }}
      />
    </svg>
  );
}
