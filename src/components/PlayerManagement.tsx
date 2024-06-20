import { ChangeEvent, useEffect, useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPlayersData, PlayersInfoResponse } from "../api";
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
  const [isNextPageDisabled, setIsNextPageDisabled] = useState(true);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["fetchPlayersData", nextCursor, itemsPerPage, debouncedQueryStr],
    queryFn: () =>
      fetchPlayersData(nextCursor, itemsPerPage, debouncedQueryStr),
  });

  const players: IPlayer[] | undefined = data?.data;
  const meta: IMeta | undefined = data?.meta;
  const isPreviousPageDisabled = meta?.prev_cursor == undefined;

  const prefetchPlayersData = async (
    queryClient: QueryClient,
    meta: IMeta,
    itemsPerPage: number,
    debouncedQueryStr: string
  ) => {
    await queryClient.prefetchQuery({
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

    const prefetchedData: PlayersInfoResponse | undefined =
      queryClient.getQueryData([
        "fetchPlayersData",
        meta?.next_cursor,
        itemsPerPage,
        debouncedQueryStr,
      ]);
    if (prefetchedData?.data && prefetchedData.data.length > 0) {
      setIsNextPageDisabled(false);
    } else {
      setIsNextPageDisabled(true);
    }
  };

  useEffect(() => {
    if (meta?.next_cursor) {
      prefetchPlayersData(queryClient, meta, itemsPerPage, debouncedQueryStr);
    } else {
      setIsNextPageDisabled(true);
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
