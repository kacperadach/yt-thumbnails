import { useEffect, useRef, useState } from "react";

interface DraggableProps {
  dragEnabled: boolean;
  containerRef?: React.RefObject<HTMLOrSVGElement>;
  onPositionUpdate: (x: number, y: number) => void;
  onDragFinish: (x: number, y: number) => void;
  children: React.ReactNode;
  zIndex?: number;
  rotationAngle: number;
}

export default function Draggable(props: DraggableProps) {
  const {
    dragEnabled,
    containerRef,
    onDragFinish,
    children,
    onPositionUpdate,
    zIndex,
    rotationAngle,
  } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dragPositionRef = useRef<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    dragPositionRef.current = dragPosition;
  }, [dragPosition]);

  useEffect(() => {
    if (!containerRef?.current || !isDragging) {
      return;
    }

    const onMouseUp = () => {
      //   if (selectedAssetId.value !== asset.id) {
      //     return;
      //   }
      setIsDragging(false);
      onDragFinish(
        dragPositionRef.current?.x ?? 0,
        dragPositionRef.current?.y ?? 0
      );

      setDragPosition(null);
    };

    const onMouseMove = (e: any) => {
      const boundingBox = (
        containerRef.current as HTMLDivElement
      ).getBoundingClientRect();

      if (!boundingBox) {
        return;
      }

      const relativeX = (e.clientX - boundingBox.left) / boundingBox.width;
      const relativeY = (e.clientY - boundingBox.top) / boundingBox.height;

      setDragPosition({
        x: relativeX * 100,
        y: relativeY * 100,
      });
      onPositionUpdate(relativeX * 100, relativeY * 100);

      console.log("update", relativeX * 100, relativeY * 100);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{ zIndex: zIndex || 0, width: "100%", height: "100%" }}
      onMouseDown={(e) => {
        if (!dragEnabled) {
          return;
        }
        e.stopPropagation();

        setIsDragging(true);
      }}
    >
      {children}
    </div>
  );
}
