import { CSSProperties } from "react";
import { Text } from "../../lib/types";
import { generateFullLongShadow } from "../../lib/textShadow";
import { formatBorder, getBaseCssProperties } from "../../lib/utils";
import { DEFAULT_TEXT_PROPERTIES } from "../../lib/constants";
import BaseAsset from "./BaseAsset";

interface TextAssetProps {
  text: Text;
}

export default function TextAsset(props: TextAssetProps) {
  const { text } = props;

  const textProperties = {
    ...DEFAULT_TEXT_PROPERTIES,
    ...text,
  };

  const containerStyles: CSSProperties = {
    height: `${textProperties.height}px`,
    minWidth: "fit-content",
    // height: `${textProperties.height * pixelScaleFactor}px`,
    backgroundColor: textProperties.backgroundColor,
    padding: `${textProperties.padding}px`,
    textShadow:
      textProperties.longShadow &&
      `${generateFullLongShadow(
        textProperties.longShadow.width,
        textProperties.longShadow.color
      )}`,
    borderRadius: `${textProperties.borderRadius}px`,
    border: textProperties.border && formatBorder(textProperties.border, 1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (!textProperties.border) {
    if (textProperties.borderBottom) {
      containerStyles.borderBottom = formatBorder(
        textProperties.borderBottom,
        1
      );
    }

    if (textProperties.borderTop) {
      containerStyles.borderTop = formatBorder(textProperties.borderTop, 1);
    }

    if (textProperties.borderLeft) {
      containerStyles.borderLeft = formatBorder(textProperties.borderLeft, 1);
    }

    if (textProperties.borderRight) {
      containerStyles.borderRight = formatBorder(textProperties.borderRight, 1);
    }
  }

  const textStyles: CSSProperties = {
    color: textProperties.color,
    font: `${textProperties.fontWeight} ${textProperties.fontSize}px ${textProperties.fontFamily}`,
  };

  return (
    <div style={containerStyles}>
      <span style={textStyles}>{text.text}</span>
    </div>
  );
}
