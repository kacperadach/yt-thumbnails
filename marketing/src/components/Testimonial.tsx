import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import "./Testimonial.css";

interface TestimonialProps {
  name: string;
  text: string;
  imageSrc: string;
  position: "left" | "center" | "right";
}

export default function Testimonial(props: TestimonialProps) {
  const { name, text, imageSrc, position } = props;

  return (
    <div
      className={`flex flex-col w-64 shadow-lg border-2 border-gray-200 rounded testimonial ${
        position === "left" && "testimonial-left"
      } ${position === "right" && "testimonial-right"}`}
    >
      <div className="w-full mb-2">
        <RiDoubleQuotesL size="2rem" />
      </div>

      <p className="p-4 text-gray-600">{text}</p>
      <div className="w-full my-2 flex justify-end">
        <RiDoubleQuotesR size="2rem" />
      </div>

      <div className="relative h-24 flex flex-col">
        <div className="absolute -top-4 w-full flex justify-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img className="w-full h-full" src={imageSrc} alt={name} />
          </div>
        </div>
        <svg viewBox="0 0 1440 120" className="wave">
          <path
            fill={"#08d087"}
            d="M0,60 C240,120 240,0 480,60 C720,120 720,0 960,60 C1200,120 1200,0 1440,60 L1440,120 L0,120 Z"
          ></path>
        </svg>
        <div className="bg-brand flex flex-1 text-white justify-center pt-6">
          <span>{name}</span>
        </div>
      </div>
    </div>
  );
}
