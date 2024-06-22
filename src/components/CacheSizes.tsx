import React, { useState } from "react";
import { useCacheInfoUpdater } from "../hooks/useCacheInfoUpdater";
import { DraggableMinimizableWidget } from "./DraggableMinimizableWidget";

export const CacheSizes: React.FC = () => {
  const [imageCacheInfo, setImageCacheInfo] = useState({
    numberOfEntries: 0,
    sizeInBytes: 0,
  });
  const [reactQueryCacheInfo, setReactQueryCacheInfo] = useState({
    numberOfEntries: 0,
    sizeInBytes: 0,
  });

  useCacheInfoUpdater(false, setImageCacheInfo, setReactQueryCacheInfo);

  return (
    <DraggableMinimizableWidget initialPosition={{ x: 10, y: 10 }}>
      <div className="p-4">
        <p className="font-semibold">Image Cache</p>
        <p>Entries: {imageCacheInfo.numberOfEntries}</p>
        <p>
          Size: {(imageCacheInfo.sizeInBytes / (1024 * 1024)).toFixed(2)} MB
        </p>
        <hr className="my-2" />
        <p className="font-semibold">React Query Cache</p>
        <p>Entries: {reactQueryCacheInfo.numberOfEntries}</p>
        <p>
          Size: {(reactQueryCacheInfo.sizeInBytes / (1024 * 1024)).toFixed(2)}{" "}
          MB
        </p>
      </div>
    </DraggableMinimizableWidget>
  );
};
