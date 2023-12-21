export type ThumbnailAsset = {
  id: string;
  type: "image" | "text" | "shape";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width: number;
  zIndex: number;
  rotation?: number;
  aspectRatio?: string;
};

export type Image = ThumbnailAsset & {
  type: "image";
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

export type LongShadow = {
  width: number;
  color: string;
};

export type Text = ThumbnailAsset & {
  type: "text";
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
  longShadow?: LongShadow;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
};

export type Shape = ThumbnailAsset & {
  type: "shape";
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
  imageId?: string;
  imageSrc?: string;
  videoId?: string;
  videoSrc?: string;
  videoTime?: number;
};

export type Thumbnail = {
  id: string;
  assets: Array<Image | Text | Circle | Arrow>;
  background: Background;
};

export type Video = {
  id: string;
  original_url: string;
  platform: "youtube" | "twitch";
  url?: string;
  thumbnail_url?: string;
  created_at: number;
};
