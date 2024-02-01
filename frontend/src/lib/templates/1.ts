import { v4 as uuidv4 } from "uuid";
import { Thumbnail } from "../types";
import {
  DEFAULT_DROP_SHADOW_OBJECT,
  DEFAULT_IMAGE_SRC,
  DEFAULT_TEXT_PLACEHOLDER,
  EDITOR_HEIGHT,
  EDITOR_WIDTH,
} from "../constants";

export default {
  id: uuidv4(),
  background: {
    type: "color",
    color: "grey",
  },
  assets: [
    {
      id: uuidv4(),
      type: "text",
      x: 30,
      y: 85,
      width: EDITOR_WIDTH * 0.5,
      height: EDITOR_HEIGHT * 0.2,
      zIndex: 3,
      rotation: -6,
      padding: 20,
      text: DEFAULT_TEXT_PLACEHOLDER,
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
      x: 35,
      y: 15,
      width: EDITOR_WIDTH * 0.5,
      height: EDITOR_HEIGHT * 0.2,
      zIndex: 2,
      rotation: 3,
      padding: 20,
      text: DEFAULT_TEXT_PLACEHOLDER,
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
      x: 25,
      y: 50,
      width: EDITOR_WIDTH * 0.6,
      height: EDITOR_WIDTH * 0.6,

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
      x: 80,
      y: 50,
      width: EDITOR_WIDTH * 0.8,
      height: EDITOR_HEIGHT * 0.9,
      zIndex: 4,
      src: DEFAULT_IMAGE_SRC,
    },
    {
      id: uuidv4(),
      type: "shape",
      shapeType: "arrow",
      x: 62.5,
      y: 51.2,
      zIndex: 6,
      width: EDITOR_WIDTH * 0.3,
      height: EDITOR_HEIGHT * 0.15,
      headWidth: 80,
      headHeight: 65,
      tailWidth: 18,
      rotation: 0,
      dropShadow: DEFAULT_DROP_SHADOW_OBJECT,
      color: "red",
      tailColor: "red",
      headColor: "red",
      start: {
        x: 97.6,
        y: 129.8,
      },
      middle: {
        x: 45.8,
        y: 99.6,
      },
      end: {
        x: 9.5,
        y: 38.7,
      },
    },
  ],
} as Thumbnail;
