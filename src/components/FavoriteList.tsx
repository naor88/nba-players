import { ChangeEvent, useEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlayersData,
  fetchPlayersStats,
  PlayersInfoResponse,
} from "../api";
import { IMeta, IPlayer } from "../types";
import { PlayersDialog } from "./PlayersDialog";
import { useDebounce } from "../hooks/useDebounce";

import { debouncedDelay, initiateCurser, initiateItemsPerPage } from "../utils";
import { useFavorites } from "../hooks/useFavorites";

export const FavoriteListTest = () => {
  const { favorites } = useFavorites();
  return <FavoriteList favorites={favorites} />;
};

export const FavoriteList = ({ favorites }: { favorites: number[] }) => {
  const queryClient = useQueryClient();
  const [nextCursor, setNextCursor] = useState<number>(initiateCurser);
  const [itemsPerPage, setItemsPerPage] = useState(initiateItemsPerPage);
  const [queryStr, setQueryStr] = useState("");
  const debouncedQueryStr = useDebounce(queryStr, debouncedDelay);
  const [isNextPageDisabled, setIsNextPageDisabled] = useState(true);

  const playersDataQuery = useQuery({
    queryKey: [
      "fetchPlayersData",
      nextCursor,
      itemsPerPage,
      debouncedQueryStr,
      ...favorites,
    ],
    queryFn: () =>
      fetchPlayersData(nextCursor, itemsPerPage, debouncedQueryStr, favorites),
    enabled: favorites && favorites.length > 0,
  });

  const playersStateQuery = useQuery({
    queryKey: [
      "fetchPlayersStats",
      nextCursor,
      itemsPerPage,
      debouncedQueryStr,
      ...favorites,
    ],
    queryFn: () =>
      fetchPlayersStats(nextCursor, itemsPerPage, debouncedQueryStr, favorites),
    enabled: favorites && favorites.length > 0,
  });

  const players: IPlayer[] =
    favorites && favorites.length > 0 ? playersDataQuery?.data?.data || [] : [];
  const meta: IMeta | undefined =
    favorites && favorites.length > 0
      ? playersDataQuery?.data?.meta
      : undefined;

  const isPreviousPageDisabled = meta?.prev_cursor == undefined;

  const prefetchPlayersData = async (
    queryClient: QueryClient,
    meta: IMeta,
    itemsPerPage: number,
    debouncedQueryStr: string,
    favorites: number[]
  ) => {
    await queryClient.prefetchQuery({
      queryKey: [
        "fetchPlayersData",
        meta?.next_cursor,
        itemsPerPage,
        debouncedQueryStr,
        ...favorites,
      ],
      queryFn: () =>
        fetchPlayersData(
          meta?.next_cursor,
          itemsPerPage,
          debouncedQueryStr,
          favorites
        ),
      staleTime: 1000 * 60,
    });

    const prefetchedData: PlayersInfoResponse | undefined =
      queryClient.getQueryData([
        "fetchPlayersData",
        meta?.next_cursor,
        itemsPerPage,
        debouncedQueryStr,
        ...favorites,
      ]);
    if (prefetchedData?.data && prefetchedData.data.length > 0) {
      setIsNextPageDisabled(false);
    } else {
      setIsNextPageDisabled(true);
    }
  };

  useEffect(() => {
    if (meta?.next_cursor) {
      prefetchPlayersData(
        queryClient,
        meta,
        itemsPerPage,
        debouncedQueryStr,
        favorites
      );
    } else {
      setIsNextPageDisabled(true);
    }
  }, [
    queryClient,
    meta?.next_cursor,
    debouncedQueryStr,
    isNextPageDisabled,
    itemsPerPage,
    favorites,
  ]);

  return (
    <PlayersDialog
      title={`Favorite Players - Last Season Stats`}
      searchText={`Search in your ${favorites.length} Favorite Players`}
      setNextCursor={setNextCursor}
      nextCursor={nextCursor}
      queryStr={queryStr}
      setQueryStr={setQueryStr}
      onSearch={(event: ChangeEvent<HTMLInputElement>) => {
        setQueryStr(event.target.value);
        setNextCursor(initiateCurser);
      }}
      isPreviousPageDisabled={isPreviousPageDisabled}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      isNextPageDisabled={isNextPageDisabled}
      isLoading={playersDataQuery.isLoading || playersStateQuery.isLoading}
      isError={playersDataQuery.isError || playersStateQuery.isError}
      error={playersDataQuery.error || playersStateQuery.error}
      players={players}
      playersState={playersStateQuery?.data?.data}
      meta={meta}
      notFound={
        favorites && favorites.length > 0 ? (
          <h1 className="text-warning font-bold text-xl">No Data Found</h1>
        ) : (
          <>
            <h1 className="text-warning font-bold text-xl">
              Your Favorite List Still Empty!
            </h1>
            <h1 className="text-warning font-bold text-lg text-ellipsis whitespace-nowrap">
              Select your favorite players by clicking on ♡ icon
            </h1>
          </>
        )
      }
    />
  );
};
