import { Col } from "react-bootstrap";
import ThumbnailPreview from "../thumbnails/ThumbnailComposition";
import { remToPx } from "../../lib/utils";
import { TEMPLATE_PREVIEW_WIDTH } from "../../lib/constants";
import { Thumbnail } from "../../lib/types";
import { useRef } from "react";

interface OptionProps {
  thumbnailOption: Thumbnail;
  onSelect: (template: Thumbnail) => void;
}

export default function Option(props: OptionProps) {
  const { thumbnailOption, onSelect } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  console.log(thumbnailOption);

  return (
    <Col
      md={3}
      className="flex items-center"
      onClick={() => {
        onSelect(thumbnailOption);
      }}
    >
      <div
        style={{ minWidth: "100%" }}
        ref={containerRef}
        className="w-full px-2 py-1 max-w-sm rounded-xl shadow-lg flex items-center hover:bg-brand-green transition duration-300 ease-in-out cursor-pointer"
      >
        {/* {containerRef.current && ( */}
        <ThumbnailPreview
          thumbnail={thumbnailOption}
          width={
            containerRef.current?.clientWidth || remToPx(TEMPLATE_PREVIEW_WIDTH)
          }
          height={
            (containerRef.current?.clientWidth ||
              remToPx(TEMPLATE_PREVIEW_WIDTH)) *
            (9 / 16)
          }
        />
        {/* )} */}
      </div>
    </Col>
  );
}
