import { HiOutlineTemplate, HiOutlineLibrary } from "react-icons/hi";

interface HomeSidebarProps {
  selectedTab: "templates" | "library";
  setSelectedTab: (tab: "templates" | "library") => void;
}

export default function HomeSidebar(props: HomeSidebarProps) {
  const { selectedTab, setSelectedTab } = props;

  return (
    <div className="flex-column rounded-xl shadow-lg">
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
