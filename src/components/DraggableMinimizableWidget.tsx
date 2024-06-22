import React, { useState, useEffect, useRef, CSSProperties, useCallback, useMemo } from "react";
import { HiMiniMinusCircle } from "react-icons/hi2";
import { SiAmazonelasticache } from "react-icons/si";

interface DraggableMinimizableWidgetProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
}

export const DraggableMinimizableWidget: React.FC<DraggableMinimizableWidgetProps> = ({ children, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);
  const [minimizedIconPosition, setMinimizedIconPosition] = useState({ x: 0, y: 0 });

  const widgetRef = useRef<HTMLDivElement>(null);
  const cacheManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cacheManagerRef.current && widgetRef.current) {
      const rect = cacheManagerRef.current.getBoundingClientRect();
      const widgetRect = widgetRef.current.getBoundingClientRect();
      const newX = rect.left + rect.width / 2 - widgetRect.width / 2;
      const newY = rect.top + rect.height / 2 - widgetRect.height / 2;
      setMinimizedIconPosition({ x: newX, y: newY });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    if (!widgetRef.current) return;

    const pos = widgetRef.current.getBoundingClientRect();
    setRel({ x: e.clientX - pos.left, y: e.clientY - pos.top });
    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    if (!widgetRef.current) return;

    const newX = e.clientX - rel.x;
    const newY = e.clientY - rel.y;

    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - widgetRef.current.offsetWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - widgetRef.current.offsetHeight));

    setPosition({ x: constrainedX, y: constrainedY });

    e.stopPropagation();
    e.preventDefault();
  }, [dragging, rel]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleDocumentMouseUp = () => handleMouseUp();

    if (dragging) {
      document.addEventListener("mousemove", handleDocumentMouseMove);
      document.addEventListener("mouseup", handleDocumentMouseUp);
    } else {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const toggleMinimize = useCallback(() => {
    setMinimized(!minimized);
  }, [minimized]);

  const widgetStyle: CSSProperties = useMemo(() => ({
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: minimized
      ? `translate(${minimizedIconPosition.x - position.x}px, ${minimizedIconPosition.y - position.y}px) scale(0.1)`
      : `scale(1)`,
    opacity: minimized ? 0 : 1,
    transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
    position: "fixed",
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "move",
    color: "black",
    zIndex: 40,
  }), [position, minimized, minimizedIconPosition]);

  return (
    <>
      <div
        ref={cacheManagerRef}
        className="fixed top-3 right-6 cursor-pointer z-50"
        onClick={toggleMinimize}
      >
        <SiAmazonelasticache size={30} />
      </div>
      <div
        ref={widgetRef}
        style={widgetStyle}
        onMouseDown={handleMouseDown}
        className="border-blue-700 border-4 w-62 h-62 min-w-62 min-h-62"
      >
        <button className="absolute top-1 right-2 text-sm" onClick={toggleMinimize}>
          <HiMiniMinusCircle color="black" />
        </button>
        {children}
      </div>
    </>
  );
};
