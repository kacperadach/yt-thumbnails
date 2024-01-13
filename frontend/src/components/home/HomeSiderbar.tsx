import {
  HiOutlineTemplate,
  HiOutlineLibrary,
  HiPencilAlt,
} from "react-icons/hi";
import { Thumbnail } from "../../lib/types";
import { BLANK_TEMPLATE } from "../../lib/constants";

interface HomeSidebarProps {
  selectedTab: "templates" | "library";
  setSelectedTab: (tab: "templates" | "library") => void;
  onTemplateSelect: (template: Thumbnail) => void;
}

export default function HomeSidebar(props: HomeSidebarProps) {
  const { selectedTab, setSelectedTab, onTemplateSelect } = props;

  return (
    <div className="flex-column rounded-xl shadow-lg">
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer `}
        onClick={() => {
          onTemplateSelect(BLANK_TEMPLATE);
        }}
      >
        <HiPencilAlt size="3rem" />
        <span>Start from Scratch</span>
      </div>
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedTab === "templates" && "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedTab("templates");
        }}
      >
        <HiOutlineTemplate size="3rem" />
        <span>Templates</span>
      </div>
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedTab === "library" && "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedTab("library");
        }}
      >
        <HiOutlineLibrary size="3rem" />
        <span>Library</span>
      </div>
    </div>
  );
}
