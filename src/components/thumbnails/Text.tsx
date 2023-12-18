import { CSSProperties } from "react";
import { Text } from "../../lib/types";
import { generateFullLongShadow } from "../../lib/textShadow";
import { formatBorder,  getBaseCssProperties } from "../../lib/utils";
import { DEFAULT_TEXT_PROPERTIES } from "../../lib/constants";

interface TextAssetProps {
  text: Text;
  pixelScaleFactor: number;
}

export default function TextAsset(props: TextAssetProps) {
  const { text, pixelScaleFactor } = props;

  const textProperties = {
    ...DEFAULT_TEXT_PROPERTIES,
    ...text,
  };


  const containerStyles: CSSProperties = {
    ...getBaseCssProperties(text),
    left: `${textProperties.left}%`,
    right: `${textProperties.right}%`,
    top: `${textProperties.top}%`,
    bottom: `${textProperties.bottom}%`,
    height: "fit-content",
    zIndex: textProperties.zIndex,
    position: "absolute",
    backgroundColor: textProperties.backgroundColor,
    padding: `${textProperties.padding * pixelScaleFactor}px`,
    transform: `rotate(${textProperties.rotation}deg)`,
    textShadow:
      textProperties.longShadow &&
      `${generateFullLongShadow(
        textProperties.longShadow.width * pixelScaleFactor,
        textProperties.longShadow.color
      )}`,
    borderRadius: `${textProperties.borderRadius * pixelScaleFactor}px`,
    border:
      textProperties.border &&
      formatBorder(textProperties.border, pixelScaleFactor),
    borderBottom:
      textProperties.borderBottom &&
      formatBorder(textProperties.borderBottom, pixelScaleFactor),
    borderTop:
      textProperties.borderTop &&
      formatBorder(textProperties.borderTop, pixelScaleFactor),
    borderLeft:
      textProperties.borderLeft &&
      formatBorder(textProperties.borderLeft, pixelScaleFactor),
    borderRight:
      textProperties.borderRight &&
      formatBorder(textProperties.borderRight, pixelScaleFactor),
  };

  const textStyles: CSSProperties = {
    color: textProperties.color,
    font: `${textProperties.fontWeight} ${
      textProperties.fontSize * pixelScaleFactor
    }px ${textProperties.fontFamily}`,
  };

  return (
    <div style={containerStyles}>
      <span style={textStyles}>{text.text}</span>
    </div>
  );
}
