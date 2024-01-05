import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";
import { Thumbnail } from "../lib/types";
import { EDITOR_WIDTH, TEMPLATE_PREVIEW_WIDTH } from "../lib/constants";
import "./marketingStyles.css";
import { Container, Row, Col } from "react-bootstrap";
import ThumbnailPreview, {
  ThumbnailComposition,
} from "../components/thumbnails/ThumbnailComposition";
import { remToPx, typeString } from "../lib/utils";
import VideoUpload from "./VideoUpload";
import ImageUpload from "./ImageUpload";
import TemplateSelect from "./TemplateSelect";
import { useNavigate } from "react-router-dom";
import EditAndRender from "./EditAndRender";
import { TEMPLATES } from "../lib/templates/templates";

const redirect = process.env.REACT_APP_MARKETING_URL_REDIRECT || "/";

const VIDEO_URL = "/videos/sample.webm";

export default function MarketingPage() {
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState<Thumbnail>({
    id: uuidv4(),
    background: {
      type: "color",
      color: "transparent",
    },
    assets: [],
  });
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [titleText, setTitleText] = useState<string>("");
  const [subText, setSubText] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setWidth = () => {
      if (!containerRef.current) {
        setTimeout(setWidth, 50);
        return;
      }
      const previewWidth = containerRef.current?.clientWidth;
      setPreviewWidth(previewWidth - remToPx(3));
    };

    setWidth();
  }, []);

  useEffect(() => {
    typeString("High Quality Thumbnails", 1000, setTitleText);
    setTimeout(() => {
      typeString("made easy", 500, setSubText);
    }, 1300);

    setTimeout(() => {
      setStepNumber(1);
    }, 1000);
  }, []);

  return (
    <Container fluid className="flex-column justify-center ">
      <Row className="w-full flex justify-center my-2">
        <Col md={4} className="flex-column justify-center items-center">
          <div>
            <div
              className=" rounded-xl shadow-lg p-6 my-4 mx-16"
              style={{ width: "fit-content", height: "fit-content" }}
            >
              <h1 className="font-bold text-5xl">
                <span className="logoTextGleam text-5xl">{titleText}</span>
                <br></br>
                <span>{subText}</span>
              </h1>
            </div>

            {stepNumber >= 5 && (
              <div
                className="rounded-xl shadow-lg p-6 my-4 mx-16 drop-in"
                style={{ width: "fit-content", height: "fit-content" }}
              >
                <button
                  className="ctaButton px-6 py-2"
                  onClick={() => {
                    window.location.href = redirect;
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </Col>
        <Col md={3}>
          <div
            className="rounded-xl shadow-lg p-6 w-full h-full flex align-center justify-center"
            ref={containerRef}
          >
            {previewWidth && (
              <ThumbnailPreview
                thumbnail={thumbnail}
                width={previewWidth}
                height={previewWidth * (9 / 16)}
                editable={false}
                marketing={true}
              />
            )}
          </div>
        </Col>
      </Row>
      {stepNumber >= 1 && (
        <Row className="w-full flex justify-center items-center my-4 drop-in">
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4 ">
              <div>
                <h4 className="font-bold">
                  Select one of our pre-made templates
                </h4>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div
              className="flex rounded-xl shadow-lg p-6 mx-4 overflow-hidden  "
              ref={templatesRef}
            >
              <TemplateSelect
                onFinish={() => {
                  setThumbnail({ ...TEMPLATES[0], id: uuidv4() });
                  setStepNumber(2);
                }}
              />
            </div>
          </Col>
        </Row>
      )}
      {stepNumber >= 2 && (
        <Row className="w-full flex justify-center  items-center my-4 drop-in">
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <div>
                <h4 className="font-bold">
                  Link your YouTube or Twitch Video to use as the background
                </h4>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <VideoUpload
                onFinish={() => {
                  setThumbnail((prev) => {
                    return {
                      ...prev,
                      background: {
                        type: "video",
                        videoSrc: VIDEO_URL,
                        videoTime: 1,
                        zoom: 1.4,
                        x: 30,
                        y: 65,
                      },
                    };
                  });
                  setStepNumber(3);
                }}
              />
            </div>
          </Col>
        </Row>
      )}
      {stepNumber >= 3 && (
        <Row className="w-full flex justify-center  items-center my-4 drop-in">
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <div>
                <h4 className="font-bold">
                  Upload images to make the background transparent
                </h4>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <ImageUpload
                onFinish={(imageUrl: string) => {
                  setThumbnail((prev) => {
                    return {
                      ...prev,
                      assets: prev.assets.map((asset) => {
                        if (asset.type !== "image") {
                          return asset;
                        }

                        return {
                          ...asset,
                          id: uuidv4(),
                          src: imageUrl,
                          width: EDITOR_WIDTH * 0.8,
                          y: 55,
                        };
                      }),
                    };
                  });
                  setStepNumber(4);
                }}
              />
            </div>
          </Col>
        </Row>
      )}
      {stepNumber >= 4 && (
        <Row className="w-full flex justify-center  items-center my-4 drop-in">
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <div>
                <h4 className="font-bold">Edit and Render</h4>
              </div>
            </div>
          </Col>
          <Col md={2}>
            <div className="flex-column rounded-xl shadow-lg p-6 mx-4">
              <EditAndRender
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
                onFinish={() => setStepNumber(5)}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
