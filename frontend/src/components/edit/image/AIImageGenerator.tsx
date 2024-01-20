import {
  Button,
  Flex,
  IconButton,
  Text,
  TextArea,
  Tooltip,
} from "@radix-ui/themes";
import { useState } from "react";
import { HiMiniSparkles } from "react-icons/hi2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdInfoOutline } from "react-icons/md";
import { fetchAIImage, generateImage } from "../../../lib/api";
import { addErrorAlert, aiImages } from "../../../lib/signals";
import { AIImageResource } from "../../../lib/types";
import { Spinner } from "react-bootstrap";

const MAX_PROMPT_LENGTH = 120;

const PROMPT_DESCRIPTION = "Describe what you want to see in the image.";
const NEGATIVE_PROMPT_DESCRIPTION =
  "Describe what you don't want to see in the image.";

interface AIImageGeneratorProps {
  onBackClick: () => void;
  unModifiableWidth?: number;
  unModifiableHeight?: number;
  onImageGenerated: (
    image: AIImageResource,
    width: number,
    height: number
  ) => void;
}

export default function AIImageGenerator(props: AIImageGeneratorProps) {
  const {
    onBackClick,
    unModifiableWidth,
    unModifiableHeight,
    onImageGenerated,
  } = props;

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState(unModifiableWidth || 512);
  const [height, setHeight] = useState(unModifiableHeight || 512);
  const [isGenerating, setIsGenerating] = useState(false);

  const onGenerate = async () => {
    setIsGenerating(true);
    const response = await generateImage(prompt, negativePrompt, width, height);

    if (!response.success) {
      setIsGenerating(false);
      addErrorAlert("Failed to generate image. Please try again.");
      return;
    }

    const imageId = response.data.id;

    let polling: NodeJS.Timeout;

    const fetchImage = async () => {
      const response = await fetchAIImage(imageId);

      if (!response.success) {
        addErrorAlert("Failed to generate image. Please try again.");
        clearInterval(polling);
        setIsGenerating(false);
        return;
      }

      const image = response.data as AIImageResource;

      if (image.status === "done") {
        clearInterval(polling);
        aiImages.value = [...aiImages.value, image];
        setIsGenerating(false);
        onImageGenerated(image, width, height);
        return;
      } else if (image.status === "failed") {
        clearInterval(polling);
        addErrorAlert("Failed to generate image. Please try again.");
        setIsGenerating(false);
        return;
      }
    };

    fetchImage();

    polling = setInterval(fetchImage, 1000);
  };

  return (
    <Flex direction="column">
      <Flex className="w-full">
        <IconButton onClick={onBackClick}>
          <IoMdArrowRoundBack />
        </IconButton>
      </Flex>
      <Flex className="w-full" direction="column">
        <Flex align="center">
          <label className="mr-2">Prompt</label>
          <Tooltip content={PROMPT_DESCRIPTION}>
            <IconButton variant="ghost">
              <MdInfoOutline />
            </IconButton>
          </Tooltip>
        </Flex>
        <TextArea
          style={{ resize: "none" }}
          maxLength={MAX_PROMPT_LENGTH}
          placeholder="What do you want to see..."
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Flex>
      <Flex className="w-full" direction="column">
        <Flex align="center">
          <label className="mr-2">Negative Prompt</label>
          <Tooltip content={NEGATIVE_PROMPT_DESCRIPTION}>
            <IconButton variant="ghost">
              <MdInfoOutline />
            </IconButton>
          </Tooltip>
        </Flex>
        <TextArea
          style={{ resize: "none" }}
          maxLength={MAX_PROMPT_LENGTH}
          placeholder="What don't you want to see..."
          onChange={(e) => setNegativePrompt(e.target.value)}
        />
      </Flex>
      <Flex className="w-full" direction="column">
        <label>Width</label>
        <input
          type="number"
          className="border-2 border-gray-200 rounded-md p-1"
          value={width}
          onChange={(e) => {
            setWidth(parseInt(e.target.value));
          }}
          disabled={isGenerating}
        />
      </Flex>
      <Flex className="w-full" direction="column">
        <label>Height</label>
        <input
          type="number"
          className="border-2 border-gray-200 rounded-md p-1"
          value={height}
          onChange={(e) => {
            setHeight(parseInt(e.target.value));
          }}
          disabled={isGenerating}
        />
      </Flex>

      <Flex className="w-full" my="2">
        <Button className="w-full p-4" onClick={onGenerate}>
          {!isGenerating ? (
            <>
              <HiMiniSparkles />
              <Text size="5">Generate</Text>
              <HiMiniSparkles />
            </>
          ) : (
            <Spinner />
          )}
        </Button>
      </Flex>
    </Flex>
  );
}
