import { useState, useEffect } from "react";
import { Thumbnail } from "../lib/types";
import Templates from "./Templates";
import { thumbnail } from "../lib/signals";
import Editor from "./edit/Editor";

export default function Home() {
  return (
    <div>
      {!thumbnail.value && <Templates />}
      {thumbnail.value && <Editor />}
    </div>
  );
}
