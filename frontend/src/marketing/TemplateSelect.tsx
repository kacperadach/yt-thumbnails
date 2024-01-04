import { useRef, useEffect, useState } from "react";
import ThumbnailPreview from "../components/thumbnails/ThumbnailComposition";
import { TEMPLATES } from "../lib/constants";
import { remToPx } from "../lib/utils";

const TEMPLATE_WIDTH = 10;

interface TemplateSelectProps {
  onFinish: () => void;
}

export default function TemplateSelect(props: TemplateSelectProps) {
  const { onFinish } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const scrollToRight = () => {
    // Scrolls to the right end of the div

    if (!divRef.current) {
      return;
    }
    divRef.current.scrollTo({
      left: divRef.current.scrollWidth,
      behavior: "smooth",
    });
    setTimeout(() => {
      onFinish();
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToRight();
    }, 1000);
  }, []);

  return (
    <div className="flex overflow-scroll" ref={divRef}>
      {TEMPLATES.slice(0, 10)
        .reverse()
        .map((template, index) => {
          return (
            <div
              key={index}
              className="px-2 max-w-sm mx-8 my-2 rounded-xl shadow-lg flex items-center hover:bg-brand-green transition duration-300 ease-in-out cursor-pointer"
            >
              <ThumbnailPreview
                thumbnail={template}
                width={remToPx(TEMPLATE_WIDTH)}
                height={remToPx(TEMPLATE_WIDTH) * (9 / 16)}
              />
            </div>
          );
        })}
      <div className="mx-4" />
    </div>
  );
}
