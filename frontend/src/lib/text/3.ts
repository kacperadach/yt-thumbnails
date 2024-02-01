import {
  DEFAULT_TEXT_PLACEHOLDER,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
  EMPTY_BORDER_OBJECT,
} from "../constants";
import { Text } from "../types";

export default {
  id: "",
  type: "text",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.5,
  height: EDITOR_HEIGHT * 0.2,
  zIndex: 0,
  rotation: 0,
  padding: 20,
  text: DEFAULT_TEXT_PLACEHOLDER,
  color:
    "linear-gradient(360deg, rgba(58,244,11,1) 2%, RGBA(168,250,179,1) 31%, rgba(230.979,246.993,230.979,1) 73%)",
  backgroundColor: "transparent",
  longShadow: {
    width: 0,
    color: "black",
  },
  textShadow: {
    x: 14,
    y: 15,
    blur: 13,
    color: "black",
  },
  borderRadius: 0,
  fontFamily: "Arial",
  fontWeight: 900,
  fontSize: 72,
} as Text;
