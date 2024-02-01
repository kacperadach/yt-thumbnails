import {
  HiOutlineTemplate,
  HiOutlineLibrary,
  HiPencilAlt,
} from "react-icons/hi";
import { Thumbnail } from "../../lib/types";
import { BLANK_TEMPLATE } from "../../lib/constants";
import { PiImagesDuotone, PiPencilLineBold } from "react-icons/pi";

interface HomeSidebarProps {
  selectedTab: "create" | "library";
  setSelectedTab: (tab: "create" | "library") => void;
  onTemplateSelect: (template: Thumbnail) => void;
}

export default function HomeSidebar(props: HomeSidebarProps) {
  const { selectedTab, setSelectedTab, onTemplateSelect } = props;

  return (
    <div className="flex-column rounded-xl shadow-lg">
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer  ${
          selectedTab === "create" && "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedTab("create");
          // onTemplateSelect(BLANK_TEMPLATE);
        }}
      >
        <PiPencilLineBold size="3rem" />
        <span className="font-medium">Create Thumbnail</span>
      </div>
      {/* <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedTab === "templates" && "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedTab("templates");
        }}
      >
        <HiOutlineTemplate size="3rem" />
        <span>Templates</span>
      </div> */}
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedTab === "library" && "bg-gray-200"
        }`}
        onClick={() => {
          setSelectedTab("library");
        }}
      >
        <PiImagesDuotone size="3rem" />
        <span className="font-medium">Library</span>
      </div>
    </div>
  );
}
