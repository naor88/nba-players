import React, { useState, useEffect, useRef, CSSProperties } from "react";

interface DraggableWidgetProps {
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  minimized: boolean;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  position,
  setPosition,
  minimized,
  children,
}) => {
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

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

    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - widgetRect.width));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - widgetRect.height));

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

  const widgetStyle: CSSProperties = {
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: minimized ? 'scale(0.1)' : 'scale(1)',
    transition: 'transform 1s ease-in-out, opacity 1s ease-in-out',
    position: 'fixed',
    backgroundColor: 'white',
    opacity: 0.9,
    padding: '16px',
    border: '1px solid gray',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'move',
    color: 'black',
    zIndex: 50,
  };

  return (
    <div
      ref={widgetRef}
      style={widgetStyle}
      onMouseDown={handleMouseDown}
      className="draggable-widget"
    >
      {children}
    </div>
  );
};
