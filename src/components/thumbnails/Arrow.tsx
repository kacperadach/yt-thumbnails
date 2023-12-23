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
    overflow: "visible",
    position: "absolute",
    display: "inline-block",
    filter:
      arrow.dropShadow && `drop-shadow(${formatDropShadow(arrow.dropShadow)})`,
  };

  const headStyles: CSSProperties = {
    width: "5rem",
    height: "5rem",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    clipPath: "polygon(100% 0%, 0 0, 50% 100%)",
    overflow: "visible",
    position: "relative",
  };

  const tailStyles: CSSProperties = {
    width: "1rem",
    height: "20rem",
    borderRadius: "50%/50% 50% 0 0",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",

    transform: "translate(-50%, -100%)",
    zIndex: 1000,
    overflow: "visible",
    left: "2.5rem",
    top: 0,
    position: "absolute",
  };

  return (
    <div style={containerStyles}>
      <div style={headStyles} />
      <div style={tailStyles} />
    </div>
  );
}
