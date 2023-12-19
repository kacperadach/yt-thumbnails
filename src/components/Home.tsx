import { useState, useEffect } from "react";
import { Thumbnail } from "../lib/types";
import Templates from "./Templates";
import { thumbnail } from "../lib/signals";
import Editor from "./Editor";

export default function Home() {
  console.log(thumbnail);
  return (
    <div>
      {!thumbnail.value && <Templates />}
      {thumbnail.value && <Editor />}
    </div>
  );
}
