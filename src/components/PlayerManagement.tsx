import { ChangeEvent, useEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersData, PlayersInfoResponse } from "../api";
import { IMeta, IPlayer } from "../types";
import { PlayersDialog } from "./PlayersDialog";
import { initiateCurser, initiateItemsPerPage, debouncedDelay } from "../utils";
import { useDebounce } from "../hooks/useDebounce";
import { QUERY_KEYS } from "../services/queryKeys";

export const PlayerManagement = () => {
  const queryClient = useQueryClient();
  const [nextCursor, setNextCursor] = useState<number>(initiateCurser);
  const [itemsPerPage, setItemsPerPage] = useState(initiateItemsPerPage);
  const [queryStr, setQueryStr] = useState("");
  const deferredQueryStr = useDebounce(queryStr, debouncedDelay);
  const [isNextPageDisabled, setIsNextPageDisabled] = useState(true);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: QUERY_KEYS.PLAYERS(nextCursor, itemsPerPage, deferredQueryStr),
    queryFn: () => fetchPlayersData(nextCursor, itemsPerPage, deferredQueryStr),
  });

  const players: IPlayer[] = data?.data || [];
  const meta: IMeta | undefined = data?.meta;
  const isPreviousPageDisabled = meta?.prev_cursor == undefined;

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
    setNextCursor(initiateCurser);
  };

  const prefetchPlayersData = async (
    queryClient: QueryClient,
    meta: IMeta,
    itemsPerPage: number,
    deferredQueryStr: string
  ) => {
    const playersNextPageKey = QUERY_KEYS.PLAYERS(
      meta?.next_cursor,
      itemsPerPage,
      deferredQueryStr
    );
    await queryClient.prefetchQuery({
      queryKey: playersNextPageKey,
      queryFn: () =>
        fetchPlayersData(meta?.next_cursor, itemsPerPage, deferredQueryStr),
      staleTime: 5 * 1000 * 60,
      gcTime: 10 * 1000 * 60,
    });

    const prefetchedData: PlayersInfoResponse | undefined =
      queryClient.getQueryData(playersNextPageKey);
    if (prefetchedData?.data && prefetchedData.data.length > 0) {
      setIsNextPageDisabled(false);
    } else {
      setIsNextPageDisabled(true);
    }
  };

  useEffect(() => {
    if (meta?.next_cursor) {
      prefetchPlayersData(queryClient, meta, itemsPerPage, deferredQueryStr);
    } else {
      setIsNextPageDisabled(true);
    }
  }, [
    queryClient,
    meta?.next_cursor,
    deferredQueryStr,
    isNextPageDisabled,
    itemsPerPage,
  ]);

  return (
    <PlayersDialog
      title="Explore New Players"
      searchText={"Search in DB"}
      setNextCursor={setNextCursor}
      nextCursor={nextCursor}
      queryStr={queryStr}
      setQueryStr={setQueryStr}
      onSearch={handleSearch}
      isPreviousPageDisabled={isPreviousPageDisabled}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      isNextPageDisabled={isNextPageDisabled}
      isLoading={isLoading}
      isError={isError}
      error={error}
      players={players || []}
      meta={meta}
      notFound={
        <h1 className="my-3 text-warning font-bold text-xl">
          {deferredQueryStr
            ? `No Player Found match to the search '${deferredQueryStr}`
            : "No Data Found"}
        </h1>
      }
    />
  );
};
