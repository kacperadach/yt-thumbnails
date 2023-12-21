import { useState, useEffect } from "react";
import { Thumbnail } from "../lib/types";
import Templates from "./Templates";
import { thumbnail } from "../lib/signals";
import Editor from "./edit/Editor";
import Library from "./Library";
import ApiErrorBanner from "./ApiErrorBanner";

export default function Home() {
  return (
    <div className="relative">
      <ApiErrorBanner />
      {!thumbnail.value && (
        <div>
          <div>
            <Templates />
          </div>
          <div>
            <Library />
          </div>
        </div>
      )}
      {thumbnail.value && <Editor />}
    </div>
  );
}
