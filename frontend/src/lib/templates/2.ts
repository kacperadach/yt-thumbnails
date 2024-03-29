import { v4 as uuidv4 } from "uuid";
import { Thumbnail } from "../types";
import { DEFAULT_IMAGE_SRC, EDITOR_HEIGHT, EDITOR_WIDTH } from "../constants";

export default {
  id: uuidv4(),
  background: {
    type: "color",
    color:
      "radial-gradient(circle, rgba(8,208,135,1) 30%, RGBA(0, 0, 0, 1) 88%)",
  },
  assets: [
    {
      id: uuidv4(),
      type: "image",
      x: 50,
      y: 50,
      width: EDITOR_WIDTH * 1,
      height: EDITOR_HEIGHT * 1,
      zIndex: 3,
      rotation: 0,
      src: DEFAULT_IMAGE_SRC,
      transparent: false,
    },
    {
      id: uuidv4(),
      type: "shape",
      shapeType: "rectangle",
      x: 50,
      y: 15,
      width: 1200,
      height: 144,
      zIndex: 2,
      rotation: 0,
      borderRadius: 0,
      border: {
        width: 0,
        style: "solid",
        color: "black",
      },
      dropShadow: {
        x: 0,
        y: 8,
        blur: 8,
        color: "black",
      },
      backgroundColor: "rgba(255,15,46,1)",
    },
    {
      id: uuidv4(),
      type: "text",
      x: 17.8,
      y: 15,
      width: 512,
      height: 144,
      zIndex: 4,
      rotation: 0,
      text: "SOME",
      padding: 20,
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderRadius: 15,
      border: {
        width: 0,
        style: "solid",
        color: "black",
      },
      longShadow: {
        width: 0,
        color: "black",
      },
      fontFamily: "Arial",
      fontWeight: 900,
      fontSize: 100,
      color: "white",
      textShadow: {
        x: 6,
        y: 3,
        blur: 2,
        color: "rgba(248, 31, 161, 1)",
      },
    },
    {
      id: uuidv4(),
      type: "text",
      x: 84,
      y: 15,
      width: 512,
      height: 144,
      zIndex: 4,
      rotation: 0,
      text: "TEXT",
      padding: 20,
      backgroundColor: "rgba(255, 255, 255, 0)",
      borderRadius: 15,
      border: {
        width: 0,
        style: "solid",
        color: "black",
      },
      longShadow: {
        width: 0,
        color: "black",
      },
      fontFamily: "Arial",
      fontWeight: 900,
      fontSize: 100,
      color: "white",
      textShadow: {
        x: 6,
        y: 3,
        blur: 2,
        color: "rgba(248, 31, 161, 1)",
      },
    },
    {
      id: uuidv4(),
      type: "text",
      x: 50.9,
      y: 15,
      width: 512,
      height: 144,
      zIndex: 4,
      rotation: 0,
      text: "SAMPLE",
      padding: 20,
      backgroundColor: "rgba(248, 231, 28, 0)",
      borderRadius: 15,
      border: {
        width: 0,
        style: "solid",
        color: "black",
      },
      longShadow: {
        width: 0,
        color: "black",
      },
      fontFamily: "Arial",
      fontWeight: 900,
      fontSize: 100,
      color: "rgba(240.4993090909092, 244.953, 0, 1)",
      textShadow: {
        x: 6,
        y: 3,
        blur: 2,
        color: "rgba(248, 31, 161, 1)",
      },
    },
  ],
} as Thumbnail;
