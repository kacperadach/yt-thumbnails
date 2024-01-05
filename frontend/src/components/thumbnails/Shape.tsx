import { Arrow, Circle, Rectangle, Shape, Triangle } from "../../lib/types";
import ArrowComponent from "./Arrow";
import CircleComponent from "./Circle";
import RectangleComponent from "./Rectangle";
import SvgArrow from "./SvgArrow";
import TriangleComponent from "./Triangle";

interface ShapeProps {
  shape: Shape;
}

export default function ShapeComponent(props: ShapeProps) {
  const { shape } = props;

  if (shape.shapeType === "circle") {
    return <CircleComponent circle={shape as Circle} />;
  } else if (shape.shapeType === "arrow") {
    // return <ArrowComponent arrow={shape as Arrow} />;
    return <SvgArrow arrow={shape as Arrow} />;
  } else if (shape.shapeType === "rectangle") {
    return <RectangleComponent rectangle={shape as Rectangle} />;
  } else if (shape.shapeType === "triangle") {
    return <TriangleComponent triangle={shape as Triangle} />;
  }
  return null;
}
