import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../services/queryKeys';
import { fetchPlayersData, fetchPlayersStats } from '../api';

export const useFavoritesPlayersQueries = (nextCursor: number, itemsPerPage: number, queryStr: string, favorites: number[]) => {
  const playersDataQuery = useQuery({
    queryKey: QUERY_KEYS.FAVORITES(nextCursor, itemsPerPage, queryStr, favorites),
    queryFn: () => fetchPlayersData(nextCursor, itemsPerPage, queryStr, favorites),
    enabled: favorites && favorites.length > 0,
  });

  const playersStateQuery = useQuery({
    queryKey: QUERY_KEYS.STATS(nextCursor, itemsPerPage, queryStr, favorites),
    queryFn: () => fetchPlayersStats(nextCursor, itemsPerPage, queryStr, favorites),
    enabled: favorites && favorites.length > 0,
  });

  return { playersDataQuery, playersStateQuery };
};
