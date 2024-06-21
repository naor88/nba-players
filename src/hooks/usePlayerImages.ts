import { IPlayer } from "../types";
import { getPlayerAvatar } from "../utils";
import { useQuery } from "@tanstack/react-query";

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
    queryKey: ["getPlayerAvatar", player.id],
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