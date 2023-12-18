import { Arrow } from "../../lib/types";
import { getBaseCssProperties, formatDropShadow } from "../../lib/utils";

interface ArrowProps {
  arrow: Arrow;
}

export default function ArrowComponent(props: ArrowProps) {
  const { arrow } = props;

  const containerStyles = {
    ...getBaseCssProperties(arrow),
    dropShadow: arrow.dropShadow && formatDropShadow(arrow.dropShadow),
    // transform: "none",
    overflow: "visible",
  };

  const headStyles = {
    width: "5rem",
    height: "5rem",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",
    clipPath: "polygon(100% 0%, 0 0, 50% 100%)",
    overflow: "visible",
  };

  const tailStyles = {
    width: "1rem",
    height: "20rem",
    borderRadius: "50%/50% 50% 0 0",
    background: "linear-gradient(to left, red, rgb(255, 176, 176))",

    transform: "translate(-50%, -100%)",
    zIndex: 1000,
    overflow: "visible",
    left: "2.5rem",
    top: 0,
  };

  return (
    <div className="absolute inline-block" style={containerStyles}>
      <div className="relative" style={headStyles}></div>
      <div className="absolute" style={tailStyles} />
    </div>
  );
}
