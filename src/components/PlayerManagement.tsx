import { ChangeEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersData } from "../api";
import { IMeta, IPlayer } from "../types";

import useDebounce from "../hooks/useDebounce";

import { PlayersDialog } from "./PlayersDialog";
import { debouncedDelay, initiateCurser, initiateItemsPerPage } from "../utils";

export const PlayerManagement = () => {
  const queryClient = useQueryClient();
  const [nextCursor, setNextCursor] = useState<number>(initiateCurser);
  const [itemsPerPage, setItemsPerPage] = useState(initiateItemsPerPage);
  const [queryStr, setQueryStr] = useState("");
  const debouncedQueryStr = useDebounce(queryStr, debouncedDelay);
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["fetchPlayersData", nextCursor, itemsPerPage, debouncedQueryStr],
    queryFn: () =>
      fetchPlayersData(nextCursor, itemsPerPage, debouncedQueryStr),
  });

  const players: IPlayer[] | undefined = data?.data;
  const meta: IMeta | undefined = data?.meta;
  const isNextPageDisabled = meta?.next_cursor == undefined;
  const isPreviousPageDisabled = meta?.prev_cursor == undefined;

  useEffect(() => {
    if (!isNextPageDisabled) {
      queryClient.prefetchQuery({
        staleTime: 1000 * 60,
        queryKey: [
          "fetchPlayersData",
          meta?.next_cursor,
          itemsPerPage,
          debouncedQueryStr,
        ],
        queryFn: () =>
          fetchPlayersData(meta?.next_cursor, itemsPerPage, debouncedQueryStr),
      });
    }
  }, [
    queryClient,
    meta?.next_cursor,
    debouncedQueryStr,
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
      onSearch={(event: ChangeEvent<HTMLInputElement>) => {
        setQueryStr(event.target.value);
        setNextCursor(initiateCurser);
      }}
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
          {queryStr
            ? `No Player Found match to the search '${queryStr}`
            : "No Data Found"}
        </h1>
      }
    />
  );
};
