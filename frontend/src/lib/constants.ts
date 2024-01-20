import { staticFile } from "remotion";
import {
  Thumbnail,
  Text,
  Border,
  Image,
  Circle,
  LongShadow,
  Arrow,
  DropShadow,
  Rectangle,
  Triangle,
  BoxShadow,
  TextShadow,
} from "./types";

export const APP_NAME = "Simple Thumbnail";

export const EDITOR_WIDTH = 1280;
export const EDITOR_HEIGHT = 720;
export const DEFAULT_IMAGE_SRC = `${staticFile("/images/headshot.png")}`;

export const DEFAULT_TEXT_PLACEHOLDER = "Sample Text";

export const DEFAULT_TEXT_PROPERTIES = {
  padding: 10,
  borderRadius: 10,
  rotation: 0,
  fontFamily: "Arial",
  fontSize: 16,
  fontWeight: 400,
  color: "white",
  backgroundColor: "transparent",
};

export const DEFAULT_BORDER_OBJECT: Border = {
  width: 16,
  style: "solid",
  color: "black",
};

export const DEFAULT_OUTLINE_OBJECT: Border = {
  width: 16,
  style: "solid",
  color: "white",
};

export const EMPTY_BORDER_OBJECT: Border = {
  width: 0,
  style: "solid",
  color: "white",
};

export const DEFAULT_LONG_SHADOW_OBJECT: LongShadow = {
  width: 10,
  color: "black",
};

export const DEFAULT_DROP_SHADOW_OBJECT: DropShadow = {
  x: 0,
  y: 8,
  blur: 8,
  color: "black",
};

export const DEFAULT_BOX_SHADOW_OBJECT: BoxShadow = {
  x: 0,
  y: 8,
  blur: 8,
  spread: 0,
  color: "black",
};

export const DEFAULT_TEXT_SHADOW_OBJECT: TextShadow = {
  x: 0,
  y: 8,
  blur: 8,
  color: "black",
};

export const DEFAULT_TEXT_OBJECT: Text = {
  id: "",
  type: "text",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.4,
  height: EDITOR_HEIGHT * 0.2,
  zIndex: 0,
  rotation: 0,
  text: DEFAULT_TEXT_PLACEHOLDER,
  padding: 20,
  backgroundColor: "white",
  borderRadius: 15,
  border: DEFAULT_BORDER_OBJECT,
  borderTop: EMPTY_BORDER_OBJECT,
  borderRight: EMPTY_BORDER_OBJECT,
  borderBottom: EMPTY_BORDER_OBJECT,
  borderLeft: EMPTY_BORDER_OBJECT,
  longShadow: DEFAULT_LONG_SHADOW_OBJECT,
  fontFamily: "Arial",
  fontWeight: 400,
  fontSize: 64,
  color: "white",
  textShadow: DEFAULT_TEXT_SHADOW_OBJECT,
};

export const DEFAULT_IMAGE_OBJECT: Image = {
  id: "",
  type: "image",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.2,
  zIndex: 0,
  rotation: 0,
  src: DEFAULT_IMAGE_SRC,
  transparent: false,
  dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
  imageType: "upload",
};

export const DEFAULT_CIRCLE_OBJECT: Circle = {
  id: "",
  type: "shape",
  shapeType: "circle",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.2,
  aspectRatio: "1/1",
  zIndex: 0,
  rotation: 0,
  border: DEFAULT_BORDER_OBJECT,
  outline: DEFAULT_OUTLINE_OBJECT,
  backgroundColor: "transparent",
  dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
  boxShadow: DEFAULT_BOX_SHADOW_OBJECT,
};

export const DEFAULT_ARROW_OBJECT: Arrow = {
  id: "",
  type: "shape",
  shapeType: "arrow",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.3,
  height: EDITOR_HEIGHT * 0.15,
  zIndex: 0,
  rotation: 25,
  headWidth: 80,
  headHeight: 50,
  tailWidth: 12,
  dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
  color: "red",
  headColor: "red",
  tailColor: "red",
  start: {
    x: 0,
    y: 0,
  },
  middle: {
    x: 50,
    y: 50,
  },
  end: {
    x: 100,
    y: 100,
  },
};

export const DEFAULT_RECTANGLE_OBJECT: Rectangle = {
  id: "",
  type: "shape",
  shapeType: "rectangle",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.2,
  height: EDITOR_HEIGHT * 0.2,
  zIndex: 0,
  rotation: 0,
  borderRadius: 15,
  border: DEFAULT_BORDER_OBJECT,
  borderTop: EMPTY_BORDER_OBJECT,
  borderRight: EMPTY_BORDER_OBJECT,
  borderBottom: EMPTY_BORDER_OBJECT,
  borderLeft: EMPTY_BORDER_OBJECT,
  dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
  backgroundColor: "green",
};

export const DEFAULT_TRIANGLE_OBJECT: Triangle = {
  id: "",
  type: "shape",
  shapeType: "triangle",
  x: 50,
  y: 50,
  width: EDITOR_WIDTH * 0.2,
  height: EDITOR_WIDTH * 0.2,
  zIndex: 0,
  rotation: 0,
  borderRadius: 15,
  border: DEFAULT_BORDER_OBJECT,
  borderTop: EMPTY_BORDER_OBJECT,
  borderRight: EMPTY_BORDER_OBJECT,
  borderBottom: EMPTY_BORDER_OBJECT,
  borderLeft: EMPTY_BORDER_OBJECT,
  dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
  backgroundColor: "yellow",
};

export const TEMPLATE_PREVIEW_WIDTH = 25;

export const BLANK_TEMPLATE: Thumbnail = {
  id: "",
  assets: [],
  background: {
    type: "color",
    color: "white",
  },
};
