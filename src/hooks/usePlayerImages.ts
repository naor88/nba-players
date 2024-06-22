import { useQuery } from "@tanstack/react-query";
import { IPlayer } from "../types";
import { getPlayerAvatar } from "../services/playerAvatar";
import { QUERY_KEYS } from "../services/queryKeys";
import { useEffect, useState } from "react";
import { imageCache } from "../services/ImageCache";

export interface IPlayerImage {
  id: number;
  url: {
    strCutout: string | null;
    strRender: string | null;
    strThumb: string | null;
  };
  loading: boolean;
  error: Error | null;
}

const usePlayerImages = (player: IPlayer): IPlayerImage => {
  const { data, isLoading, isError, error } = useQuery({
    staleTime: Infinity,
    gcTime: Infinity,
    queryKey: QUERY_KEYS.AVATAR(player.id),
    queryFn: () => getPlayerAvatar(player),
  });
  const [imageUrls, setImageUrls] = useState<{
    strCutout: string | null;
    strRender: string | null;
    strThumb: string | null;
  }>({ strCutout: null, strRender: null, strThumb: null });

  useEffect(() => {
    if (data) {
      const loadImages = async () => {
        const loadImagePromises = [
          data.strCutout ? imageCache.loadImage(data.strCutout) : Promise.resolve(null),
          data.strRender ? imageCache.loadImage(data.strRender) : Promise.resolve(null),
          data.strThumb ? imageCache.loadImage(data.strThumb) : Promise.resolve(null),
        ];

        const results = await Promise.allSettled(loadImagePromises);
        const [strCutout, strRender, strThumb] = results.map(result =>
          result.status === "fulfilled" ? result.value : null
        );
        setImageUrls({ strCutout, strRender, strThumb });
      };

      loadImages().catch(err => console.error("Error loading images:", err));
    }
  }, [data]);

  return {
    id: player.id,
    url: imageUrls,
    loading: isLoading,
    error: isError ? error : null,
  };
};

export default usePlayerImages;
