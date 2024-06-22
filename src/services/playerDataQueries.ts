import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../services/queryKeys";
import { fetchPlayersData } from "../api";
import { PlayersInfoResponse, IMeta } from "../types";

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
    queryKey,
    queryFn: () =>
      fetchPlayersData(next_cursor, itemsPerPage, queryStr, favorites),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });

  const prefetchedData: PlayersInfoResponse | undefined =
    queryClient.getQueryData(queryKey);

  setIsNextPageDisabled(
    !(prefetchedData?.data && prefetchedData.data.length > 0)
  );
};
