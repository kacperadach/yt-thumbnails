import { useCallback, useEffect, useRef, useState } from "react";

const DRAG_START_TIME_THRESHOLD_MS = 150;

interface DraggableProps {
  dragEnabled: boolean;
  containerRef?: React.RefObject<HTMLOrSVGElement>;
  onPositionUpdate: (x: number, y: number) => void;
  onDragFinish: (x: number, y: number) => void;
  children: React.ReactNode;
  zIndex?: number;
  relativeToClick?: boolean;
}

export default function Draggable(props: DraggableProps) {
  const {
    dragEnabled,
    containerRef,
    onDragFinish,
    children,
    onPositionUpdate,
    zIndex,
    relativeToClick,
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
  const [initialClickOffset, setInitialClickOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [dragStartTimer, setDragStartTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const draggableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dragPositionRef.current = dragPosition;
  }, [dragPosition]);

  useEffect(() => {
    if (!containerRef?.current || !isDragging) {
      return;
    }

    const onMouseUp = () => {
      if (dragStartTimer) {
        clearTimeout(dragStartTimer);
        setDragStartTimer(null);
      }
      setIsDragging(false);
      if (dragPositionRef.current) {
        onDragFinish(dragPositionRef.current.x, dragPositionRef.current.y);
      }
      setDragPosition(null);
      setInitialClickOffset(null);
    };

    const onMouseMove = (e: any) => {
      const boundingBox = (
        containerRef.current as HTMLDivElement
      ).getBoundingClientRect();

      if (!boundingBox || !draggableContainerRef.current) {
        return;
      }

      let clickDiffX = 0;
      let clickDiffY = 0;
      if (initialClickOffset) {
        const initialClickX = initialClickOffset?.x ?? 0;
        const initialClickY = initialClickOffset?.y ?? 0;

        clickDiffX =
          draggableContainerRef.current?.getBoundingClientRect().width / 2 -
          initialClickX;

        clickDiffY =
          draggableContainerRef.current?.getBoundingClientRect().height / 2 -
          initialClickY;
      }

      const relativeX =
        (e.clientX + clickDiffX - boundingBox.left) / boundingBox.width;
      const relativeY =
        (e.clientY + clickDiffY - boundingBox.top) / boundingBox.height;

      setDragPosition({
        x: relativeX * 100,
        y: relativeY * 100,
      });
      onPositionUpdate(relativeX * 100, relativeY * 100);
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
      ref={draggableContainerRef}
      style={{
        zIndex: zIndex || 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
      onMouseDown={(e) => {
        if (!dragEnabled) {
          return;
        }
        e.stopPropagation();

        const boundingBox = (
          e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();

        setDragStartTimer(
          setTimeout(() => {
            setIsDragging(true);

            const offsetX = e.clientX - boundingBox.left;
            const offsetY = e.clientY - boundingBox.top;
            if (relativeToClick) {
              setInitialClickOffset({ x: offsetX, y: offsetY });
            }
          }, DRAG_START_TIME_THRESHOLD_MS)
        );
      }}
      onMouseUp={() => {
        if (dragStartTimer) {
          clearTimeout(dragStartTimer);
          setDragStartTimer(null);
        }
      }}
    >
      {children}
    </div>
  );
}
