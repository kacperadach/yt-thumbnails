import { staticFile } from "remotion";
import { Thumbnail, Text, Border, Image, Circle, LongShadow } from "./types";
import { v4 as uuidv4 } from "uuid";

export const EDITOR_WIDTH = 1280;
export const EDITOR_HEIGHT = 720;

export const DEFAULT_IMAGE_SRC = `${staticFile("/images/headshot.png")}`;

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

export const EMPTY_BORDER_OBJECT: Border = {
  width: 0,
  style: "solid",
  color: "white",
};

export const DEFAULT_LONG_SHADOW_OBJECT: LongShadow = {
  width: 0,
  color: "white",
};

export const DEFAULT_TEXT_OBJECT: Text = {
  id: "",
  type: "text",
  top: 50,
  bottom: 0,
  left: 50,
  right: 0,
  width: EDITOR_WIDTH * 0.3,
  height: 0,
  zIndex: 0,
  rotation: 0,
  text: "Placeholder",
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
  fontSize: 72,
  color: "black",
};

export const DEFAULT_IMAGE_OBJECT: Image = {
  id: "",
  type: "image",
  top: 50,
  bottom: 0,
  left: 50,
  right: 0,
  width: EDITOR_WIDTH * 0.2,
  zIndex: 0,
  rotation: 0,
  src: DEFAULT_IMAGE_SRC,
};

export const DEFAULT_CIRCLE_OBJECT: Circle = {
  id: "",
  type: "shape",
  shapeType: "circle",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  zIndex: 0,
  rotation: 0,
  border: DEFAULT_BORDER_OBJECT,
  outline: DEFAULT_BORDER_OBJECT,
  backgroundColor: "transparent",
};

export const TEMPLATE_PREVIEW_WIDTH = 25;
export const TEMPLATES: Thumbnail[] = [
  {
    id: uuidv4(),
    background: {
      type: "color",
      color: "grey",
    },
    assets: [
      {
        id: uuidv4(),
        type: "text",
        top: 75,
        left: 10,
        width: EDITOR_WIDTH * 0.5,
        height: EDITOR_HEIGHT * 0.2,
        zIndex: 3,
        rotation: -6,
        padding: 20,
        text: "Is He Scripting?",
        color: "white",
        backgroundColor: "red",
        longShadow: {
          width: 10,
          color: "black",
        },
        borderRadius: 15,
        fontFamily: "Arial",
        fontWeight: 400,
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
      },
      {
        id: uuidv4(),
        type: "text",
        top: 5,
        left: 20,
        width: EDITOR_WIDTH * 0.5,
        height: EDITOR_HEIGHT * 0.2,
        zIndex: 2,
        rotation: 3,
        padding: 20,
        text: "She Said YES!!!",
        color: "white",
        backgroundColor: "rgb(70, 70, 221)",
        longShadow: {
          width: 10,
          color: "black",
        },
        borderRadius: 15,
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 72,
        borderBottom: {
          width: 16,
          style: "solid",
          color: "black",
        },
        borderLeft: {
          width: 16,
          style: "solid",
          color: "black",
        },
      },
      {
        id: uuidv4(),
        type: "shape",
        shapeType: "circle",
        left: 0,
        width: EDITOR_WIDTH * 0.6,
        aspectRatio: "1/1",
        zIndex: 1,
        border: {
          width: 16,
          style: "solid",
          color: "lime",
        },
        outline: {
          width: 16,
          style: "solid",
          color: "black",
        },
        backgroundColor: "transparent",
      },
      {
        id: uuidv4(),
        type: "image",
        left: 70,
        top: 10,
        width: EDITOR_WIDTH * 0.3,
        zIndex: 4,
        src: DEFAULT_IMAGE_SRC,
      },
      {
        id: uuidv4(),
        type: "shape",
        shapeType: "arrow",
        top: 50,
        left: 50,
        zIndex: 6,
        width: 0,
        rotation: 110,
        dropShadow: {
          x: 0,
          y: 8,
          blur: 8,
          color: "black",
        },
      },
    ],
  },
  {
    id: uuidv4(),
    background: {
      type: "color",
      color: "blue",
    },
    assets: [],
  },
];
