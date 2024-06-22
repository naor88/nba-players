import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PlayersDialog } from "./PlayersDialog";
import { useDebounce } from "../hooks/useDebounce";
import { debouncedDelay, initiateCurser, initiateItemsPerPage } from "../constants";
import { useFavorites } from "../hooks/useFavorites";
import { useFavoritesPlayersQueries } from "../hooks/useFavoritesPlayersQueries";
import { prefetchPlayersNextPage } from "../services/playerDataQueries";

export const FavoriteList = () => {
  const queryClient = useQueryClient();
  const [nextCursor, setNextCursor] = useState<number>(initiateCurser);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initiateItemsPerPage);
  const [queryStr, setQueryStr] = useState<string>("");
  const debouncedQueryStr = useDebounce(queryStr, debouncedDelay);
  const [isNextPageDisabled, setIsNextPageDisabled] = useState<boolean>(true);
  const { favorites } = useFavorites();

  const { playersDataQuery, playersStateQuery } = useFavoritesPlayersQueries(
    nextCursor,
    itemsPerPage,
    debouncedQueryStr,
    favorites
  );

  const { players, meta } = useMemo(() => {
    const players = favorites?.length > 0 ? playersDataQuery?.data?.data || [] : [];
    const meta = favorites?.length > 0 ? playersDataQuery?.data?.meta : undefined;
    return { players, meta };
  }, [playersDataQuery?.data, favorites]);

  const isPreviousPageDisabled = meta?.prev_cursor === undefined;

  useEffect(() => {
    if (meta?.next_cursor !== undefined && favorites.length > 0) {
      prefetchPlayersNextPage(
        queryClient,
        meta,
        itemsPerPage,
        debouncedQueryStr,
        setIsNextPageDisabled,
        favorites,
      );
    } else {
      setIsNextPageDisabled(true);
    }
  }, [queryClient, meta, debouncedQueryStr, itemsPerPage, favorites]);

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
        favorites.length > 0 ? (
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
