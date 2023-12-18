import { type } from "os";

export type ThumbnailAsset = {
  type: "image" | "text" | "shape";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width: number;
  zIndex: number;
  rotation?: number;
};

export type Image = ThumbnailAsset & {
  src: string;
};

export type Border = {
  width: number;
  style: string;
  color: string;
};

export type DropShadow = {
  x: number;
  y: number;
  blur: number;
  color: string;
};

export type Text = ThumbnailAsset & {
  height: number;
  text: string;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  border?: Border;
  borderTop?: Border;
  borderRight?: Border;
  borderBottom?: Border;
  borderLeft?: Border;
  longShadow?: {
    width: number;
    color: string;
  };
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
};

export type Shape = ThumbnailAsset & {
  shapeType: "circle" | "arrow";
};

export type Circle = Shape & {
  shapeType: "circle";
  border: Border;
  outline?: Border;
  backgroundColor?: string;
};

export type Arrow = Shape & {
  shapeType: "arrow";
  dropShadow?: DropShadow;
  // tail: {};
};

export type Background = {
  type: "color" | "image" | "video";
  color?: string;
  src?: string;
  videoTime?: number;

  // TODO: gradient?
};

export type Thumbnail = {
  assets: Array<Image | Text | Circle | Arrow>;
  background: Background;
};
