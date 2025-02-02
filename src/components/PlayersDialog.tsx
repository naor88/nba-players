import {
  ChangeEvent,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { PlayerList } from "./PlayerList";
import { renderContent } from "./renderContent";
import { IMeta, IPlayer, IStats } from "../types";
import { PlayersStates, PlayersStatesRowData } from "./PlayersState";
import { useFavorites } from "../hooks/useFavorites";
import { initiateCurser, emptyState } from "../constants";

interface PlayersDialogProps {
  title: string;
  searchText: string;
  setNextCursor: (nextCursor: number) => void;
  nextCursor: number;
  queryStr: string;
  setQueryStr: (query: string) => void;
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  isPreviousPageDisabled: boolean;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  setItemsPerPage: (item: number) => void;
  isNextPageDisabled: boolean;
  isLoading: boolean;
  isError: boolean;
  error: { name: string; message: string } | null;
  players: IPlayer[];
  meta?: IMeta;
  playersState?: IStats[];
  notFound: ReactNode;
}

export const PlayersDialog = ({
  title,
  searchText,
  setNextCursor,
  nextCursor,
  queryStr,
  setQueryStr,
  onSearch,
  isPreviousPageDisabled,
  itemsPerPage,
  itemsPerPageOptions = [1, 5, 10, 25, 50, 75, 100],
  setItemsPerPage,
  isNextPageDisabled,
  isLoading,
  isError,
  error,
  players,
  playersState,
  meta,
  notFound,
}: PlayersDialogProps) => {
  const [stack, setStack] = useState<number[]>([]);
  const { favorites } = useFavorites();

  const handlePreviousPage = useCallback(() => {
    const prevStack = [...stack];
    const lastNextCursor = prevStack.pop();
    setStack(prevStack);
    if (typeof lastNextCursor === "number") setNextCursor(lastNextCursor);
  }, [stack, setNextCursor]);

  const handleNextPage = useCallback(() => {
    setStack((prevStack) => [...prevStack, nextCursor]);
    if (meta) setNextCursor(meta.next_cursor);
  }, [nextCursor, setNextCursor, meta]);

  const playersInfo: PlayersStatesRowData[] = players
    .filter((player) => favorites.includes(player.id))
    .map((player) => {
      const state: IStats =
        playersState?.find((s) => s.player_id === player.id) || emptyState;
      return {
        player,
        state,
      };
    });

  useEffect(() => {
    if (players.length === 0 && !isPreviousPageDisabled) {
      handlePreviousPage();
    }
  }, [players.length, isPreviousPageDisabled, handlePreviousPage]);

  return (
    <div className="h-full md:h-auto overflow-y-scroll no-scrollbar overflow-auto">
      <div className="h-screen flex flex-col">
        <h1 className="text-primary font-bold text-2xl">{title}</h1>
        <div className="flex flex-row justify-between h-15 items-center my-1">
          <div className="flex flex-row w-full">
            <label className="input input-bordered flex items-center w-full">
              <input
                type="text"
                className="grow"
                placeholder={searchText}
                value={queryStr}
                onChange={onSearch}
              />
              {queryStr && (
                <IoMdCloseCircleOutline
                  className="cursor-pointer"
                  onClick={() => setQueryStr("")}
                />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="xl:join col-span-1 md:col-span-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              disabled={isError || isLoading || isPreviousPageDisabled}
              className="xl:join-item btn btn-outline w-full md:w-auto"
              onClick={handlePreviousPage}
            >
              <FaArrowAltCircleLeft />
              Previous page
            </button>
            <button
              disabled={isError || isLoading || isNextPageDisabled}
              className="xl:join-item btn btn-outline w-full md:w-auto"
              onClick={handleNextPage}
            >
              Next Page
              <FaArrowAltCircleRight />
            </button>
          </div>
          <div className="dropdown dropdown-end col-span-1">
            <div
              tabIndex={0}
              role="button"
              className="btn w-full border rounded-box"
            >
              Items Per Page {itemsPerPage}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border"
            >
              {itemsPerPageOptions.map((item) => (
                <li
                  className="cursor-pointer h-10 rounded-lg leading-10 flex flex-row justify-center hover:bg-primary"
                  key={`items_per_page_${item}`}
                  onClick={() => {
                    setItemsPerPage(item);
                    setNextCursor(initiateCurser);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {renderContent({
          isLoading,
          isError,
          error,
          children:
            players.length > 0 ? (
              playersState ? (
                <PlayersStates playersInfo={playersInfo} queryStr={queryStr} />
              ) : (
                <PlayerList players={players} queryStr={queryStr} />
              )
            ) : (
              notFound
            ),
        })}
      </div>
    </div>
  );
};
