export type FilterEffects = {
  blur?: number;
  brightness?: number;
  contrast?: number;
  dropShadow?: DropShadow;
  grayscale?: number;
  hueRotate?: number;
  invert?: number;
  opacity?: number;
  saturate?: number;
  sepia?: number;
};

export type ThumbnailAsset = FilterEffects & {
  id: string;
  type: "image" | "text" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation?: number;
  aspectRatio?: string;
};

export type ImageOutline = {
  width: number;
  color: string;
  blur: number;
};

export type Image = ThumbnailAsset & {
  type: "image";
  src: string;
  imageId?: string;
  transparent?: boolean;
  imageType: "upload" | "ai";
  imageOutline: ImageOutline;
};

export type Border = {
  width: number;
  style: string;
  color: string;
};

export type BorderWithoutStyle = {
  width: number;
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

export type BoxShadow = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
};

export type TextShadow = {
  x: number;
  y: number;
  blur: number;
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
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  longShadow?: LongShadow;
  textShadow?: TextShadow;
  letterSpacing?: number;
};

export type Shape = ThumbnailAsset & {
  type: "shape";
  shapeType: "circle" | "arrow" | "rectangle" | "triangle";
  // dropShadow?: DropShadow;
  boxShadow?: BoxShadow;
};

export type Circle = Shape & {
  shapeType: "circle";
  border: Border;
  outline?: Border;
  backgroundColor?: string;
};

export type Arrow = Shape & {
  shapeType: "arrow";
  color: string;
  headColor: string;
  tailColor: string;
  headWidth: number;
  headHeight: number;
  tailWidth: number;
  start: {
    x: number;
    y: number;
  };
  middle: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
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
  // dropShadow?: DropShadow;
};

export type Triangle = Shape & {
  shapeType: "triangle";
  color: string;
  cornerRadius?: number;
  edgeRoundness?: number;
  // dropShadow?: DropShadow;
  triangleBorder?: BorderWithoutStyle;
};

export type Background = FilterEffects & {
  type: "color" | "image" | "video";
  color?: string;
  imageId?: string;
  imageType?: "upload" | "ai";
  src?: string;
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
};

export type TemplateResource = {
  id: string;
  name: string;
  template: Thumbnail;
  created_at: number;
};

export type AIImageResource = {
  id: string;
  url: string;
  url_transparent: string;
  created_at: number;
  status: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
};
