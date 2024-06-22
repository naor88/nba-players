import React, { useState, useEffect, CSSProperties } from "react";
import { HiMiniMinusCircle } from "react-icons/hi2";
import "./Minimize.css"; // Import the custom CSS file

export const MinimizableWidget: React.FC<{
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
  lastPosition: { x: number; y: number };
  setLastPosition: (position: { x: number; y: number }) => void;
  minimizedIconPosition: { x: number; y: number };
  children: React.ReactNode;
}> = ({
  minimized,
  setMinimized,
  lastPosition,
  setLastPosition,
  minimizedIconPosition,
  children,
}) => {
  const [transformStyle, setTransformStyle] = useState<CSSProperties>({});

  const calculateTransform = (closing: boolean) => {
    const deltaX = closing ? minimizedIconPosition.x : lastPosition.x;
    const deltaY = closing ? minimizedIconPosition.y : lastPosition.y;

    return {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(${closing ? 0.1 : 1})`,
      opacity: closing ? 0.2 : 1,
      transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
    };
  };

  useEffect(() => {
    setTransformStyle(calculateTransform(minimized));
  }, [minimized, lastPosition, minimizedIconPosition]);

  const toggleMinimize = () => {
    if (!minimized) {
      const widgetRect = (document.querySelector(".minimizable-widget") as HTMLElement).getBoundingClientRect();
      setLastPosition({ x: widgetRect.left, y: widgetRect.top });
    }
    setMinimized(!minimized);
  };

  return (
    <div
      style={transformStyle}
      className="minimizable-widget transition-all duration-1000 ease-in-out"
    >
      <button
        className="absolute top-1 right-2 text-sm"
        onClick={toggleMinimize}
      >
        <HiMiniMinusCircle color="black" />
      </button>
      {children}
    </div>
  );
};
