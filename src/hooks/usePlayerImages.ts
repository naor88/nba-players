import { useQuery } from "@tanstack/react-query";
import { IPlayer } from "../types";
import { getPlayerAvatar } from "../services/playerAvatar";
import { QUERY_KEYS } from "../services/queryKeys";

export interface IPlayerImage {
  id: number;
  url: {
    strCutout: string;
    strRender: string;
    strThumb: string;
  } | null;
  loading: boolean;
  error: Error | null;
}

const usePlayerImages = (player: IPlayer): IPlayerImage => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.AVATAR(player.id),
    queryFn: () => getPlayerAvatar(player),
  });

  return {
    id: player.id,
    url: data || null,
    loading: isLoading,
    error: isError ? error : null,
  };
};

export default usePlayerImages;
