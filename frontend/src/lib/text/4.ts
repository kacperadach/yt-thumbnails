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
    "linear-gradient(180deg, rgba(64.27566720000003,57.00056310000001,187.95243689999998,1) 0%, RGBA(39.006891,39.006891,176.978109,1) 20%, rgba(253.98,254.828,255,1) 100%)",
  backgroundColor: "transparent",
  longShadow: {
    width: 10,
    color: "black",
  },
  textShadow: {
    x: 0,
    y: 0,
    blur: 8,
    color: "black",
  },
  borderRadius: 0,
  fontFamily: "Arial",
  fontWeight: 500,
  fontSize: 72,
} as Text;
