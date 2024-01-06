import { useRef, useState } from "react";
import { Arrow } from "../../lib/types";
import Draggable from "./Draggable";
import { selectedAssetId, thumbnail, thumbnails } from "../../lib/signals";

function calculateBezierMidpoint(
  start: { x: number; y: number },
  middle: { x: number; y: number },
  end: { x: number; y: number }
) {
  const t = 0.5;
  const midpoint = {
    x: (1 - t) ** 2 * start.x + 2 * (1 - t) * t * middle.x + t ** 2 * end.x,
    y: (1 - t) ** 2 * start.y + 2 * (1 - t) * t * middle.y + t ** 2 * end.y,
  };
  return midpoint;
}

function calculateControlPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  midpoint: { x: number; y: number }
) {
  const controlPoint = {
    x: 2 * midpoint.x - 0.5 * start.x - 0.5 * end.x,
    y: 2 * midpoint.y - 0.5 * start.y - 0.5 * end.y,
  };
  return controlPoint;
}

function updateArrow(
  x: number,
  y: number,
  arrow: Arrow,
  point: "start" | "middle" | "end"
) {
  const allWidths = [];
  const updateObj: any = {};

  if (point === "start") {
    allWidths.push(
      x,
      // calculateBezierMidpoint({ x, y }, arrow.middle, arrow.end).x,
      arrow.middle.x,
      arrow.end.x
    );
    updateObj["start"] = { x, y };
  } else if (point === "middle") {
    allWidths.push(arrow.start.x, x, arrow.end.x);
    updateObj["middle"] = calculateControlPoint(arrow.start, arrow.end, {
      x,
      y,
    });
  } else if (point === "end") {
    allWidths.push(arrow.start.x, arrow.middle.x, x);
    updateObj["end"] = { x, y };
  }

  const minWidth = Math.min(...allWidths);
  const maxWidth = Math.max(...allWidths);
  const diff = maxWidth - minWidth;
  const newWidth = arrow.width * (diff / 100);

  // updateObj["width"] = newWidth;

  // const newX = (arrow.x / arrow.width) * newWidth;

  // updateObj["x"] = newX;

  return {
    ...arrow,
    ...updateObj,

    // width: newWidth,
  };
}

interface SvgArrowProps {
  arrow: Arrow;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function SvgArrow(props: SvgArrowProps) {
  // Define the path for the cubic Bezier curve

  const { arrow, containerRef } = props;

  const svgContainerRef = useRef<SVGSVGElement>(null);

  const [startDragPosition, setStartDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [middleDragPosition, setMiddleDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [endDragPosition, setEndDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [hovered, isHovered] = useState(false);

  const startCoordinates = startDragPosition ?? arrow.start;
  const start = {
    x: (startCoordinates.x / 100) * svgContainerRef.current?.clientWidth!,
    y: (startCoordinates.y / 100) * svgContainerRef.current?.clientHeight!,
  };

  const middleCoordinates = middleDragPosition ?? arrow.middle;
  const middle = {
    x: (middleCoordinates.x / 100) * svgContainerRef.current?.clientWidth!,
    y: (middleCoordinates.y / 100) * svgContainerRef.current?.clientHeight!,
  };

  const endCoordinates = endDragPosition ?? arrow.end;
  const end = {
    x: (endCoordinates.x / 100) * svgContainerRef.current?.clientWidth!,
    y: (endCoordinates.y / 100) * svgContainerRef.current?.clientHeight!,
  };

  const pathData = `M${start.x},${start.y} Q${middle.x},${middle.y} ${end.x},${end.y}`;
  const bezierMidpoint = calculateBezierMidpoint(start, middle, end);

  let headColor = arrow.color;
  if (arrow.headColor) {
    headColor = arrow.headColor;
  }

  let tailColor = arrow.color;
  if (arrow.tailColor) {
    tailColor = arrow.tailColor;
  }

  const headPathData = `M${end.x},${end.y} l10,0`;

  return (
    <div style={{ position: "relative" }}>
      <Draggable
        rotationAngle={arrow.rotation || 0}
        zIndex={100}
        dragEnabled={true}
        containerRef={svgContainerRef}
        onPositionUpdate={(x: number, y: number) => {
          setStartDragPosition({ x, y });
        }}
        onDragFinish={(x: number, y: number) => {
          // update arrow position
          thumbnails.value = thumbnails.value.map((t) => {
            if (t.id !== thumbnail.value?.id) {
              return t;
            }

            const newVal = {
              ...thumbnail.value,
              assets: thumbnail.value.assets.map((a) => {
                if (a.id === arrow.id) {
                  return updateArrow(x, y, a as Arrow, "start");
                }
                return a;
              }),
            };
            return newVal;
          });
          setStartDragPosition(null);
        }}
      >
        <div
          className={`${
            (hovered || selectedAssetId.value === arrow.id) &&
            "outline-dashed outline-offset-2 outline-white"
          } absolute rounded-full`}
          onMouseEnter={() => isHovered(true)}
          onMouseLeave={() => isHovered(false)}
          style={{
            width: "2rem",
            height: "2rem",
            left: start.x,
            top: start.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      </Draggable>
      <Draggable
        rotationAngle={arrow.rotation || 0}
        zIndex={100}
        dragEnabled={true}
        containerRef={svgContainerRef}
        onPositionUpdate={(x: number, y: number) => {
          console.log(start, end, { x, y });

          // const mid = {
          //   x: (x / 100) * svgContainerRef.current?.clientWidth!,
          //   y: (y / 100) * svgContainerRef.current?.clientHeight!,
          // };

          const controlPoint = calculateControlPoint(arrow.start, arrow.end, {
            x,
            y,
          });
          setMiddleDragPosition(controlPoint);
        }}
        onDragFinish={(x: number, y: number) => {
          // update arrow position
          thumbnails.value = thumbnails.value.map((t) => {
            if (t.id !== thumbnail.value?.id) {
              return t;
            }

            const newVal = {
              ...thumbnail.value,
              assets: thumbnail.value.assets.map((a) => {
                if (a.id === arrow.id) {
                  return updateArrow(x, y, a as Arrow, "middle");
                }
                return a;
              }),
            };
            return newVal;
          });
          setMiddleDragPosition(null);
        }}
      >
        <div
          className={`${
            (hovered || selectedAssetId.value === arrow.id) &&
            "outline-dashed outline-offset-2 outline-white"
          } absolute rounded-full`}
          onMouseEnter={() => isHovered(true)}
          onMouseLeave={() => isHovered(false)}
          style={{
            width: "2rem",
            height: "2rem",
            left: bezierMidpoint.x,
            top: bezierMidpoint.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      </Draggable>
      <Draggable
        rotationAngle={arrow.rotation || 0}
        zIndex={100}
        dragEnabled={true}
        containerRef={svgContainerRef}
        onPositionUpdate={(x: number, y: number) => {
          setEndDragPosition({ x, y });
        }}
        onDragFinish={(x: number, y: number) => {
          // update arrow position
          thumbnails.value = thumbnails.value.map((t) => {
            if (t.id !== thumbnail.value?.id) {
              return t;
            }

            const newVal = {
              ...thumbnail.value,
              assets: thumbnail.value.assets.map((a) => {
                if (a.id === arrow.id) {
                  return updateArrow(x, y, a as Arrow, "end");
                }
                return a;
              }),
            };
            return newVal;
          });
          setEndDragPosition(null);
        }}
      >
        <div
          className={`${
            (hovered || selectedAssetId.value === arrow.id) &&
            "outline-dashed outline-offset-2 outline-white"
          } absolute rounded-full`}
          onMouseEnter={() => isHovered(true)}
          onMouseLeave={() => isHovered(false)}
          style={{
            width: "2rem",
            height: "2rem",
            left: end.x,
            top: end.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      </Draggable>
      <svg
        ref={svgContainerRef}
        style={{
          overflow: "visible",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Define the arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth={arrow.headHeight * 2}
            markerHeight={arrow.headWidth * 2}
            // refX={arrow.headWidth / 2}
            refX={0}
            refY={arrow.headWidth / 2}
            orient="auto"
            markerUnits="userSpaceOnUse"
            strokeWidth={100}
          >
            <polygon
              points={`0,0 ${arrow.headHeight},${arrow.headWidth / 2} 0,${
                arrow.headWidth
              }`}
              fill={headColor}
            />
          </marker>
        </defs>
        <defs>
          {/* Drop shadow filter */}
          {arrow.dropShadow && (
            <filter
              id="dropshadow"
              x="-200%"
              y="-200%"
              width="1000%"
              height="1000%"
            >
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation={arrow.dropShadow.blur}
              />
              <feOffset
                dx={arrow.dropShadow.x}
                dy={arrow.dropShadow.y}
                result="offsetblur"
              />
              <feFlood floodColor={arrow.dropShadow.color} result="color" />
              <feComposite in2="offsetblur" operator="in" in="color" />
              <feComposite in2="SourceAlpha" operator="in" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="offsetblur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}

          {/* ... other defs ... */}
        </defs>

        {/* Path using the arrowhead marker */}
        <path
          d={pathData}
          fill="none"
          stroke={tailColor}
          style={{ strokeWidth: arrow.tailWidth }}
          markerEnd="url(#arrowhead)"
          markerUnits={"userSpaceOnUse"}
          filter="url(#dropshadow)"
        />

        {/* Path for the arrowhead */}
        {/* <path
          d={headPathData}
          fill={headColor}
          stroke={headColor}
          style={{ strokeWidth: arrow.headWidth }}
        /> */}
      </svg>
    </div>
  );
}
