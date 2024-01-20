import { AIImageResource, ImageResource } from "../../../lib/types";

interface SelectableImageProps {
  image: ImageResource | AIImageResource;
  handleSelect: (image: ImageResource | AIImageResource) => void;
  width?: string;
  height?: string;
}

export default function SelectableImage(props: SelectableImageProps) {
  const { image, handleSelect, width, height } = props;
  if (!image) {
    return null;
  }

  return (
    <div
      style={{ width, height }}
      className={`p-2 w-full h-full flex items-center justify-center relative rounded hover:bg-gray-200 cursor-pointer`}
      onClick={() => {
        handleSelect(image);
      }}
    >
      {image.url && (
        <img src={image.url} className="w-full h-full object-contain" />
      )}
    </div>
  );
}
