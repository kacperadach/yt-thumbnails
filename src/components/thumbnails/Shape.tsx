import { Arrow, Circle, Shape } from "../../lib/types";
import ArrowComponent from "./Arrow";
import CircleComponent from "./Circle";

interface ShapeProps {
  shape: Shape;
}

export default function ShapeComponent(props: ShapeProps) {
  const { shape } = props;

  if (shape.shapeType === "circle") {
    return <CircleComponent circle={shape as Circle} />;
  } else if (shape.shapeType === "arrow") {
    return <ArrowComponent arrow={shape as Arrow} />;
  }
  return null;
}
