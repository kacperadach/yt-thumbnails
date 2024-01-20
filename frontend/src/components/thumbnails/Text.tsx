import { CSSProperties } from "react";
import { Text } from "../../lib/types";
import { generateFullLongShadow } from "../../lib/textShadow";
import { formatBorder, formatTextShadow } from "../../lib/utils";
import { DEFAULT_TEXT_PROPERTIES } from "../../lib/constants";

interface TextAssetProps {
  text: Text;
}

export default function TextAsset(props: TextAssetProps) {
  const { text } = props;

  const textProperties = {
    ...DEFAULT_TEXT_PROPERTIES,
    ...text,
  };

  let textShadow = "";
  let filterTextShadow = "";
  if (textProperties.longShadow && textProperties.longShadow.width > 0) {
    textShadow = `${generateFullLongShadow(
      textProperties.longShadow.width,
      textProperties.longShadow.color
    )}`;
  }

  if (textProperties.textShadow && textProperties.textShadow.blur > 0) {
    filterTextShadow = formatTextShadow(textProperties.textShadow);
  }

  console.log(textShadow);

  const containerStyles: CSSProperties = {
    height: `${textProperties.height}px`,
    minWidth: "fit-content",
    // height: `${textProperties.height * pixelScaleFactor}px`,
    backgroundColor: textProperties.backgroundColor,
    padding: `${textProperties.padding}px`,
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
    backgroundColor: textProperties.color,
    backgroundImage: textProperties.color,
    font: `${textProperties.fontWeight} ${textProperties.fontSize}px ${textProperties.fontFamily}`,
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text", // Standard property, as a fallback
    backgroundSize: "cover",
    filter: `drop-shadow(${filterTextShadow})`,
    margin: 0,
    position: "absolute",
  };

  const shadowStyles: CSSProperties = {
    ...textStyles,
    // color: "transparent", // Makes the text itself transparent
    WebkitTextFillColor: "", // Remove the transparent fill
    WebkitBackgroundClip: "", // Remove the background clip
    backgroundClip: "", // Standard property, as a fallback
    textShadow,
    backgroundColor: "transparent",
    color: "transparent",
  };

  return (
    <div style={containerStyles}>
      <h1 style={shadowStyles}>{text.text}</h1>
      <h1 style={textStyles}>{text.text}</h1>
    </div>
  );
}
