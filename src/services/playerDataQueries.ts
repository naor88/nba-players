import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../services/queryKeys";
import { fetchPlayersData } from "../api";
import { PlayersInfoResponse, IMeta, IPlayer } from "../types";
import { getPlayerAvatar } from "./playerAvatar";
import { imageCache } from "./ImageCache";

const STALE_TIME = 5 * 1000 * 60; // 5 minutes
const GC_TIME = 10 * 1000 * 60; // 10 minutes

export const prefetchPlayersNextPage = async (
  queryClient: QueryClient,
  meta: IMeta,
  itemsPerPage: number,
  queryStr: string,
  setIsNextPageDisabled: (disabled: boolean) => void,
  favorites?: number[]
): Promise<void> => {
  const { next_cursor } = meta;

  if ((favorites && favorites.length === 0) || next_cursor === undefined) {
    return;
  }

  const queryKey = favorites
    ? QUERY_KEYS.FAVORITES(next_cursor, itemsPerPage, queryStr, favorites)
    : QUERY_KEYS.PLAYERS(next_cursor, itemsPerPage, queryStr);

  await queryClient.prefetchQuery({
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    queryKey,
    queryFn: async () => {
      const data = await fetchPlayersData(meta.next_cursor, itemsPerPage, queryStr, favorites);
      if(!data) return;
      await Promise.all(data.data.map(async (player: IPlayer) => {
        const avatarKey = QUERY_KEYS.AVATAR(player.id);
        await queryClient.prefetchQuery({
          queryKey: avatarKey,
          queryFn: async () => {
            const avatarData = await getPlayerAvatar(player);
            await Promise.allSettled([
              avatarData.strCutout ? imageCache.loadImage(avatarData.strCutout) : null,
              avatarData.strRender ? imageCache.loadImage(avatarData.strRender) : null,
              avatarData.strThumb ? imageCache.loadImage(avatarData.strThumb) : null,
            ]);
            return avatarData;
          },
        });
      }));
      return data;
    },
  });

  const prefetchedData: PlayersInfoResponse | undefined =
    queryClient.getQueryData(queryKey);

  setIsNextPageDisabled(
    !(prefetchedData?.data && prefetchedData.data.length > 0)
  );
};
