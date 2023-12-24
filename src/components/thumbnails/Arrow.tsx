import { CSSProperties } from "react";
import { Arrow } from "../../lib/types";
import { getBaseCssProperties, formatDropShadow } from "../../lib/utils";

interface ArrowProps {
  arrow: Arrow;
}

export default function ArrowComponent(props: ArrowProps) {
  const { arrow } = props;

  const containerStyles: CSSProperties = {
    // ...getBaseCssProperties(arrow),
    // dropShadow: arrow.dropShadow && formatDropShadow(arrow.dropShadow),
    // transform: "none",
    width: "100%",
    height: "100%",
    overflow: "visible",
    display: "inline-block",
    filter:
      arrow.dropShadow && `drop-shadow(${formatDropShadow(arrow.dropShadow)})`,
    position: "relative",
  };

  const headStyles: CSSProperties = {
    width: `${arrow.headLength}%`,
    // height: `${arrow.headHeight}px`,
    height: "100%",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
  };

  const tailStyles: CSSProperties = {
    width: "1rem",
    height: "20rem",
    borderRadius: "50%/50% 50% 0 0",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    transform: "rotate(90deg)",
    zIndex: 1000,
    position: "absolute",
  };

  return (
    <div style={containerStyles}>
      <div style={headStyles} />
      <div style={tailStyles} />
    </div>
  );
}
