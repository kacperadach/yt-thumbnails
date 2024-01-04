import { useState } from "react";
import { Alert } from "react-bootstrap";
import { useSignalEffect } from "@preact/signals-react";
import { BsX } from "react-icons/bs";
import { apiError } from "../lib/api";

export default function ApiErrorBanner() {
  const [dismissed, setDismissed] = useState(false);

  useSignalEffect(() => {
    if (apiError.value) {
      setDismissed(false);
    }
  });

  if (!apiError.value || dismissed) {
    return null;
  }
  return (
    <div
      className="absolute"
      style={{
        width: "fit-content",
        top: "5%",
        zIndex: 100,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="rounded border bg-red-200 p-4 flex items-center justify-center">
        <div>
          <span className="font-bold text-xl">{apiError.value}</span>
        </div>
        <div
          className="cursor-pointer h-full"
          onClick={() => setDismissed(true)}
        >
          <BsX size="1.5rem" />
        </div>
      </div>
    </div>
  );
}
