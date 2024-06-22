import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersData } from "../api";
import { IMeta, IPlayer } from "../types";
import { PlayersDialog } from "./PlayersDialog";
import {
  initiateCurser,
  initiateItemsPerPage,
  debouncedDelay,
} from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import { QUERY_KEYS } from "../services/queryKeys";
import { prefetchPlayersNextPage } from "../services/playerDataQueries";

export const PlayerManagement = () => {
  const queryClient = useQueryClient();
  const [nextCursor, setNextCursor] = useState<number>(initiateCurser);
  const [itemsPerPage, setItemsPerPage] =
    useState<number>(initiateItemsPerPage);
  const [queryStr, setQueryStr] = useState<string>("");
  const deferredQueryStr = useDebounce(queryStr, debouncedDelay);
  const [isNextPageDisabled, setIsNextPageDisabled] = useState<boolean>(true);

  const queryKey = useMemo(
    () => QUERY_KEYS.PLAYERS(nextCursor, itemsPerPage, deferredQueryStr),
    [nextCursor, itemsPerPage, deferredQueryStr]
  );

  const { isLoading, isError, error, data } = useQuery({
    queryKey,
    queryFn: () => fetchPlayersData(nextCursor, itemsPerPage, deferredQueryStr),
  });

  const players: IPlayer[] = data?.data || [];
  const meta: IMeta | undefined = data?.meta;
  const isPreviousPageDisabled = meta?.prev_cursor === undefined;

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
    setNextCursor(initiateCurser);
  }, []);

  useEffect(() => {
    if (meta?.next_cursor !== undefined) {
      prefetchPlayersNextPage(
        queryClient,
        meta,
        itemsPerPage,
        deferredQueryStr,
        setIsNextPageDisabled
      );
    } else {
      setIsNextPageDisabled(true);
    }
  }, [queryClient, meta, deferredQueryStr, itemsPerPage]);

  return (
    <PlayersDialog
      title="Explore New Players"
      searchText="Search in DB"
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
      players={players}
      meta={meta}
      notFound={
        <h1 className="my-3 text-warning font-bold text-xl">
          {deferredQueryStr
            ? `No Player Found matching the search '${deferredQueryStr}'`
            : "No Data Found"}
        </h1>
      }
    />
  );
};
