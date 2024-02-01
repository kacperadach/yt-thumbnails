import { Flex, IconButton } from "@radix-ui/themes";
import { PiRectangle, PiImageLight } from "react-icons/pi";
import { FaClone } from "react-icons/fa6";
import { FaPencilAlt, FaPlayCircle } from "react-icons/fa";
import { Thumbnail } from "../../lib/types";
import { BLANK_TEMPLATE } from "../../lib/constants";
import { useState } from "react";
import Templates from "./Templates";
import { IoArrowBack } from "react-icons/io5";

interface CreateThumbnailProps {
  selectedTab: "create" | "library";
  onTemplateSelect: (template: Thumbnail) => void;
}

export default function CreateThumbnail(props: CreateThumbnailProps) {
  const { selectedTab, onTemplateSelect } = props;

  const [showTemplates, setShowTemplates] = useState(false);

  if (selectedTab !== "create") {
    return null;
  }

  return (
    <Flex align="center" direction="column">
      {!showTemplates && (
        <>
          <Flex mt="4" align="center">
            <h1 className="logoText leading-tight tracking-tighter text-5xl drop-shadow-sm ">
              Choose how to get started
            </h1>
          </Flex>
          <Flex>
            <Flex
              direction="column"
              align="center"
              className="p-8 m-8 rounded-xl shadow-lg cursor-pointer hover:text-white hover:scale-110 hover:bg-brand-green transition duration-300 ease-in-out tracking-tighter"
              onClick={() => onTemplateSelect(BLANK_TEMPLATE)}
            >
              <h2>Create from Scratch</h2>
              <FaPencilAlt size="3rem" />
              <h5 className="my-4">Start from a blank slate</h5>
            </Flex>
            <Flex
              direction="column"
              align="center"
              className="p-8 m-8 rounded-xl shadow-lg cursor-pointer hover:text-white hover:scale-110 hover:bg-brand-green transition duration-300 ease-in-out tracking-tighter"
              onClick={() => setShowTemplates(true)}
            >
              <h2>Create from Template</h2>
              <FaClone size="3rem" />
              <h5 className="my-4">Use a pre-made template</h5>
            </Flex>
          </Flex>
        </>
      )}
      {showTemplates && (
        <>
          <Flex>
            <Flex align="center" justify="center">
              <IconButton onClick={() => setShowTemplates(false)} mx="2">
                <IoArrowBack size="3rem" />
              </IconButton>
              <h1 className="tracking-tighter m-0">Select a Template</h1>
            </Flex>
          </Flex>
          <Templates onTemplateSelect={onTemplateSelect} />
        </>
      )}
    </Flex>
  );
}
