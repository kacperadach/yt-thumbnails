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
  color:
    "linear-gradient(360deg, rgba(245,166,35,1) 2%, RGBA(244.99838234999999, 172.38468039142856, 51.97461764999997, 1) 31%, rgba(235.99280999999996,211.5383148571429,170.98719,1) 73%)",
  backgroundColor: "rgba(245, 166, 35, 0.6)",
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
  borderRadius: 15,
  fontFamily: "Arial",
  fontWeight: 500,
  fontSize: 72,
} as Text;

//   backgroundColor
// :
// "rgba(245, 166, 35, 0.6)"
// blur
// :
// 0
// borderRadius
// :
// 15
// brightness
// :
// 1
// color
// :
// "linear-gradient(360deg, rgba(245,166,35,1) 2%, RGBA(244.99838234999999, 172.38468039142856, 51.97461764999997, 1) 31%, rgba(235.99280999999996,211.5383148571429,170.98719,1) 73%)"
// contrast
// :
// 100
// dropShadow
// :
// {x: 0, y: 0, blur: 0, color: "black"}
// fontFamily
// :
// "Archivo Black"
// fontSize
// :
// 72
// fontWeight
// :
// 900
// grayscale
// :
// 0
// height
// :
// 144
// hueRotate
// :
// 0
// id
// :
// "570dbd1d-4805-4c44-ac0d-200f742211c2"
// invert
// :
// 0
// longShadow
// :
// {width: 0, color: "black"}
// opacity
// :
// 100
// padding
// :
// 20
// rotation
// :
// 0
// saturate
// :
// 100
// sepia
// :
// 0
// text
// :
// "Sample Text"
// textShadow
// :
// {x: 14, y: 15, blur: 13, color: "black"}
// type
// :
// "text"
// width
// :
// 640
// x
// :
// 36.89217758985201
// y
// :
// 56.20300751879699
// zIndex
// :
// 7
