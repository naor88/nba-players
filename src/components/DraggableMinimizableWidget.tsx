import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { HiMiniMinusCircle } from "react-icons/hi2";
import { SiAmazonelasticache } from "react-icons/si";
import "./Minimize.css"; // Import the custom CSS file

interface DraggableMinimizableWidgetProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
}

export const DraggableMinimizableWidget: React.FC<
  DraggableMinimizableWidgetProps
> = ({ children, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);
  const [lastPosition, setLastPosition] = useState(initialPosition);
  const [minimizedIconPosition, setMinimizedIconPosition] = useState({
    x: 0,
    y: 0,
  });

  const widgetRef = useRef<HTMLDivElement>(null);
  const cacheManagerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cacheManagerRef.current && widgetRef.current) {
      const rect = cacheManagerRef.current.getBoundingClientRect();
      const widgetRect = widgetRef.current.getBoundingClientRect();
      const newX = rect.left + (rect.width / 2) - (widgetRect.width / 2);
      const newY = rect.top + (rect.height / 2) - (widgetRect.height / 2);
      setMinimizedIconPosition({ x: newX, y: newY });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    if (!widgetRef.current) return;

    const pos = widgetRef.current.getBoundingClientRect();
    setRel({ x: e.pageX - pos.left, y: e.pageY - pos.top });
    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    if (!widgetRef.current) return;

    const widgetRect = widgetRef.current.getBoundingClientRect();
    const newX = e.clientX - rel.x;
    const newY = e.clientY - rel.y;

    const constrainedX = Math.max(
      0,
      Math.min(newX, window.innerWidth - widgetRect.width)
    );
    const constrainedY = Math.max(
      0,
      Math.min(newY, window.innerHeight - widgetRect.height)
    );

    setPosition({ x: constrainedX, y: constrainedY });

    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const toggleMinimize = () => {
    if (!minimized) {
      const widgetRect = widgetRef.current?.getBoundingClientRect();
      if (widgetRect) {
        setLastPosition({ x: widgetRect.left, y: widgetRect.top });
      }
    }
    setMinimized(!minimized);
  };

  const widgetStyle: CSSProperties = {
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: minimized
      ? `translate(${(minimizedIconPosition.x - position.x)}px, ${
          (minimizedIconPosition.y - position.y)
        }px) scale(0.1)`
      : `scale(1)`,
    opacity: minimized ? 0 : 1,
    display: minimized ? 'none' : '',
    transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
    position: "fixed",
    backgroundColor: "white",
    // opacity: 0.9,
    padding: "16px",
    border: "1px solid gray",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "move",
    color: "black",
    zIndex: 50,
  };

  return (
    <>
      <div
        ref={cacheManagerRef}
        className="fixed top-3 right-6 cursor-pointer z-50"
        onClick={toggleMinimize}
      >
        <SiAmazonelasticache size={30} />
      </div>
      <div ref={widgetRef} style={widgetStyle} onMouseDown={handleMouseDown}>
        <button
          className="absolute top-1 right-2 text-sm"
          onClick={toggleMinimize}
        >
          <HiMiniMinusCircle color="black" />
        </button>
        {children}
      </div>
    </>
  );
};
