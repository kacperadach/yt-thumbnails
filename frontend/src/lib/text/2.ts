import {
  DEFAULT_TEXT_PLACEHOLDER,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
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
  color: "white",
  backgroundColor: "red",
  longShadow: {
    width: 8,
    color: "black",
  },
  borderRadius: 15,
  fontFamily: "Arial",
  fontWeight: 800,
  fontSize: 72,
  borderBottom: {
    width: 16,
    style: "solid",
    color: "rgb(151, 6, 6)",
  },
  borderLeft: {
    width: 16,
    style: "solid",
    color: "rgb(151, 6, 6)",
  },
} as Text;
