import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { imageCache } from '../services/ImageCache';
import { getReactQueryCacheInfo } from '../services/cacheSizeUtil';
import { SiAmazonelasticache } from "react-icons/si";
import { HiMiniMinusCircle } from "react-icons/hi2";

export const CacheSizes: React.FC = () => {
  const queryClient = useQueryClient();
  const [imageCacheInfo, setImageCacheInfo] = useState({ numberOfEntries: 0, sizeInBytes: 0 });
  const [reactQueryCacheInfo, setReactQueryCacheInfo] = useState({ numberOfEntries: 0, sizeInBytes: 0 });
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 10, y: 10 });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateCacheInfo = () => {
      setImageCacheInfo({
        numberOfEntries: imageCache.getCacheSize(),
        sizeInBytes: imageCache.getCacheSizeInBytes()
      });
      setReactQueryCacheInfo(getReactQueryCacheInfo(queryClient));
    };

    if (!minimized) {
      updateCacheInfo();
      interval = setInterval(updateCacheInfo, 1000);
    }

    return () => clearInterval(interval);
  }, [queryClient, minimized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button

    const pos = e.currentTarget.getBoundingClientRect();
    setRel({
      x: e.pageX - pos.left,
      y: e.pageY - pos.top
    });

    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    setPosition({
      x: e.pageX - rel.x,
      y: e.pageY - rel.y
    });

    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const handleMinimize = () => {
    setLastPosition(position);
    setMinimized(true);
  };

  const handleRestore = () => {
    setPosition(lastPosition);
    setMinimized(false);
  };

  if (minimized) {
    return (
      <div className="fixed top-3 right-6 cursor-pointer z-50" onClick={handleRestore}>
        <SiAmazonelasticache size={30} />
      </div>
    );
  }

  return (
    <div
      className="fixed bg-white bg-opacity-90 p-4 border border-gray-300 rounded-lg shadow-lg z-50 cursor-move text-black"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onMouseDown={handleMouseDown}
    >
      <button className="absolute top-1 right-2 text-sm" onClick={handleMinimize}>
        <HiMiniMinusCircle color='black'/>
      </button>
      <p className="font-semibold">Image Cache</p>
      <p>Entries: {imageCacheInfo.numberOfEntries}</p>
      <p>Size: {(imageCacheInfo.sizeInBytes / (1024 * 1024)).toFixed(2)} MB</p>
      <hr className="my-2" />
      <p className="font-semibold">React Query Cache</p>
      <p>Entries: {reactQueryCacheInfo.numberOfEntries}</p>
      <p>Size: {(reactQueryCacheInfo.sizeInBytes / (1024 * 1024)).toFixed(2)} MB</p>
    </div>
  );
};
