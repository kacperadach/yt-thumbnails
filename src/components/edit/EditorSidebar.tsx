import { BsCardImage } from "react-icons/bs";
import { HiOutlineCollection } from "react-icons/hi";
import { selectedAssetId, selectedMenu } from "../../lib/signals";

interface EditorSidebarProps {}

export default function EditorSidebar(props: EditorSidebarProps) {
  return (
    <div className="flex-column rounded-xl shadow-lg">
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedMenu.value === "background" && "bg-gray-200"
        }`}
        onClick={() => {
          selectedAssetId.value = null;
          selectedMenu.value = "background";
        }}
      >
        <BsCardImage size="3rem" />
        <span>Background</span>
      </div>
      <div
        className={`flex flex-column justify-center w-full items-center my-2 py-4 hover:bg-gray-200 rounded cursor-pointer ${
          selectedMenu.value === "assets" && "bg-gray-200"
        }`}
        onClick={() => {
          selectedAssetId.value = null;
          selectedMenu.value = "assets";
        }}
      >
        <HiOutlineCollection size="3rem" />
        <span>Assets</span>
      </div>
    </div>
  );
}
