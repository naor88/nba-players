import { useEffect } from "react";
import { imageCache } from "../services/ImageCache";
import { getReactQueryCacheInfo } from "../services/cacheSizeUtil";
import { useQueryClient } from "@tanstack/react-query";

export const useCacheInfoUpdater = (minimized: boolean, setImageCacheInfo: any, setReactQueryCacheInfo: any) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateCacheInfo = () => {
      setImageCacheInfo({
        numberOfEntries: imageCache.getCacheSize(),
        sizeInBytes: imageCache.getCacheSizeInBytes(),
      });
      setReactQueryCacheInfo(getReactQueryCacheInfo(queryClient));
    };

    if (!minimized) {
      updateCacheInfo();
      interval = setInterval(updateCacheInfo, 1000);
    }

    return () => clearInterval(interval);
  }, [queryClient, minimized, setImageCacheInfo, setReactQueryCacheInfo]);
};
