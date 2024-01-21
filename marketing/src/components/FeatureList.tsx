import { BsCheck, BsCheck2 } from "react-icons/bs";

export default function FeatureList() {
  return (
    <div className="flex flex-col w-full justify-center">
      <div className="m-auto">
        <h3 className="font-bold text-2xl mb-4">
          All the tools you need to create eye-catching Thumbnails without an
          editor
        </h3>

        <ul className="font-bold text-lg list-none">
          <div className="mx-16">
            <li className="font-semibold flex items-center">
              <BsCheck2 size={"2rem"} color="white" className="mx-2" />
              <span>Beautiful Free Templates</span>
            </li>
            <li className="font-semibold flex items-center">
              <BsCheck2 size={"2rem"} color="white" className="mx-2" />
              <span>Custom Templates</span>
            </li>
            <li className="font-semibold flex items-center">
              <BsCheck2 size={"2rem"} color="white" className="mx-2" />
              <span>AI Generated Images</span>
            </li>

            <li className="font-semibold flex items-center">
              <BsCheck2 size={"2rem"} color="white" className="mx-2" />
              <span>Automatic transparent image backgrounds</span>
            </li>

            <li className="font-semibold flex items-center">
              <BsCheck2 size={"2rem"} color="white" className="mx-2" />
              <span>Youtube or Twitch videos in background</span>
            </li>
          </div>

          <div className="flex justify-center">
            <h3 className="font-bold text-2xl mt-4">
              All packaged into the simplest Thumbnail creator on the web
            </h3>
          </div>
        </ul>
      </div>
    </div>
  );
}
