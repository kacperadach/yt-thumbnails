import { DEFAULT_EMPTY_EFFECTS_OBJECT } from "../constants";
import { Text } from "../types";
import TextStyleOne from "./1";
import TextStyleTwo from "./2";
import TextStyleThree from "./3";
import TextStyleFour from "./4";
import TextStyleFive from "./5";

export const TEXT_STYLES: Text[] = [
  { ...DEFAULT_EMPTY_EFFECTS_OBJECT, ...TextStyleOne },
  { ...DEFAULT_EMPTY_EFFECTS_OBJECT, ...TextStyleTwo },
  { ...DEFAULT_EMPTY_EFFECTS_OBJECT, ...TextStyleThree },
  { ...DEFAULT_EMPTY_EFFECTS_OBJECT, ...TextStyleFour },
  { ...DEFAULT_EMPTY_EFFECTS_OBJECT, ...TextStyleFive },
];
