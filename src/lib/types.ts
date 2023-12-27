export type ThumbnailAsset = {
  id: string;
  type: "image" | "text" | "shape";
  x: number;
  y: number;
  width: number;
  height?: number;
  zIndex: number;
  rotation?: number;
  aspectRatio?: string;
};

export type Image = ThumbnailAsset & {
  type: "image";
  src: string;
  imageId?: string;
  transparent?: boolean;
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
  shapeType: "circle" | "arrow" | "rectangle" | "triangle";
};

export type Circle = Shape & {
  shapeType: "circle";
  aspectRatio: "1/1";
  border: Border;
  outline?: Border;
  backgroundColor?: string;
};

export type Arrow = Shape & {
  shapeType: "arrow";
  dropShadow?: DropShadow;
  headWidth: number;
  tailWidth: number;
  backgroundColor: string;
};

export type Rectangle = Shape & {
  shapeType: "rectangle";
  backgroundColor: string;
  borderRadius?: number;
  border?: Border;
  borderTop?: Border;
  borderRight?: Border;
  borderBottom?: Border;
  borderLeft?: Border;
  dropShadow?: DropShadow;
};

export type Triangle = Shape & {
  shapeType: "triangle";
  backgroundColor: string;
  borderRadius?: number;
  border?: Border;
  borderTop?: Border;
  borderRight?: Border;
  borderBottom?: Border;
  borderLeft?: Border;
  dropShadow?: DropShadow;
};

export type Background = {
  type: "color" | "image" | "video";
  color?: string;
  imageId?: string;
  imageSrc?: string;
  transparent?: boolean;
  zoom?: number;
  x?: number;
  y?: number;
  videoId?: string;
  videoSrc?: string;
  videoTime?: number;
};

export type Thumbnail = {
  id: string;
  assets: Array<Image | Text | Circle | Arrow | Rectangle | Triangle>;
  background: Background;
};

export type VideoResource = {
  id: string;
  original_url: string;
  platform: "youtube" | "twitch";
  url?: string;
  thumbnail_url?: string;
  created_at: number;
  status: "pending" | "ready" | "failed";
};

export type ImageResource = {
  id: string;
  url: string;
  url_transparent: string;
  created_at: number;
  status: "pending" | "ready" | "failed";
};
