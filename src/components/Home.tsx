import { useState, useEffect } from "react";
import { Thumbnail } from "../lib/types";
import Templates from "./Templates";

export default function Home() {
  const [thumbnail, setThumbnail] = useState<Thumbnail | null>(null);

  return <div>{!thumbnail && <Templates />}</div>;
}
