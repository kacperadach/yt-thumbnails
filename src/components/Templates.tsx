import { Container, Row, Col } from "react-bootstrap";
import { Thumbnail } from "../lib/types";
import ThumbnailPreview from "./thumbnails/ThumbnailComposition";
import { pxToRem, remToPx } from "../lib/utils";
import { staticFile } from "remotion";

const TEMPLATE_PREVIEW_WIDTH = 20;

const TEMPLATES: Thumbnail[] = [
  {
    background: {
      type: "color",
      color: "grey",
    },
    assets: [
      {
        type: "text",
        top: 75,
        left: 10,
        width: 50,
        height: 10,
        zIndex: 3,
        rotation: -6,
        padding: 20,
        text: "Is He Scripting?",
        color: "white",
        backgroundColor: "red",
        longShadow: {
          width: 10,
          color: "black",
        },
        borderRadius: 15,
        fontSize: 72,
        borderBottom: {
          width: 16,
          style: "solid",
          color: "rgb(151, 6, 6)",
        },
        borderLeft: {
          width: 16,
          style: "solid",
          color: "rgb(151, 6, 6)",
        },
      },
      {
        type: "text",
        top: 5,
        left: 20,
        width: 50,
        height: 10,
        zIndex: 2,
        rotation: 3,
        padding: 20,
        text: "She Said YES!!!",
        color: "white",
        backgroundColor: "rgb(70, 70, 221)",
        longShadow: {
          width: 10,
          color: "black",
        },
        borderRadius: 15,
        fontSize: 72,
        borderBottom: {
          width: 16,
          style: "solid",
          color: "black",
        },
        borderLeft: {
          width: 16,
          style: "solid",
          color: "black",
        },
      },
      {
        type: "shape",
        shapeType: "circle",
        left: 0,
        width: 60,
        zIndex: 1,
        border: {
          width: 16,
          style: "solid",
          color: "lime",
        },
        outline: {
          width: 16,
          style: "solid",
          color: "black",
        },
        backgroundColor: "transparent",
      },
      {
        type: "image",
        left: 70,
        top: 10,
        width: 30,
        zIndex: 4,
        src: `${staticFile("/images/headshot.png")}`,
      },
      {
        type: "shape",
        shapeType: "arrow",
        top: 50,
        left: 50,
        zIndex: 6,
        width: 0,
        rotation: 110,
        dropShadow: {
          x: 0,
          y: 8,
          blur: 8,
          color: "black",
        },
      },
    ],
  },
  {
    background: {
      type: "color",
      color: "blue",
    },
    assets: [],
  },
];

export default function Templates() {
  return (
    <Container>
      <div className="">
        <div>
          <div className="text-xl font-medium text-black">Templates</div>
          <Row className="flex">
            {TEMPLATES.map((template, index) => {
              return (
                <Col
                  key={index}
                  md={3}
                  className="p-6 max-w-sm mx-10 bg-white rounded-xl shadow-lg flex items-center "
                >
                  <ThumbnailPreview
                    thumbnail={template}
                    width={remToPx(TEMPLATE_PREVIEW_WIDTH)}
                    height={remToPx(TEMPLATE_PREVIEW_WIDTH) * (9 / 16)}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </Container>
  );
}
