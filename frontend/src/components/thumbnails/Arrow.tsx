import { CSSProperties } from "react";
import { Arrow } from "../../lib/types";
import { getBaseCssProperties, formatDropShadow } from "../../lib/utils";

interface ArrowProps {
  arrow: Arrow;
}

export default function ArrowComponent(props: ArrowProps) {
  const { arrow } = props;

  const containerStyles: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    filter:
      arrow.dropShadow && `drop-shadow(${formatDropShadow(arrow.dropShadow)})`,
    position: "relative",
  };

  const headStyles: CSSProperties = {
    width: `${arrow.headWidth}%`,
    // height: `${arrow.headHeight}px`,
    height: "100%",
    // background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)",
    backgroundColor: arrow.backgroundColor,
  };

  const tailStyles: CSSProperties = {
    // width: "20rem",
    width: "100%",
    height: `${arrow.tailWidth}%`,
    // borderRadius: "50%/50% 50% 0 0",
    borderRadius: "50% 0 0 50%",
    // background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    backgroundColor: arrow.backgroundColor,
    transform: "rotate(180deg)",
    zIndex: 1000,
    // position: "absolute",
  };

  return (
    <div style={containerStyles}>
      <div style={headStyles} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={tailStyles} />
      </div>
    </div>
  );
}
