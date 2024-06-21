import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import { IPlayer, IStats } from "../types";
import { MdDeleteForever } from "react-icons/md";
import { useFavorites } from "../hooks/useFavorites";
import Avatar from "./Avatar";
import HighlightText from "./HighlightText";
import { emptyState } from "./PlayersDialog";
import { VscPassFilled, VscError } from "react-icons/vsc";
import { Modal } from "./Modal";
import { PlayerDetails } from "./PlayerDetails";
import { IPlayerImage } from "../hooks/usePlayerImages";

export type PlayersStatesRowData = {
  player: IPlayer;
  state: IStats;
  playerImage?: IPlayerImage;
};

const columnHelper = createColumnHelper<PlayersStatesRowData>();

interface PlayersStatesProps {
  playersInfo: PlayersStatesRowData[];
  queryStr: string;
}

const NO_INFO_STR = ""; //N/A

export const PlayersStates = ({
  playersInfo,
  queryStr,
}: PlayersStatesProps) => {
  const { removeFavorite } = useFavorites();
  const [data, setData] = useState(playersInfo);

  useEffect(() => {
    setData(playersInfo);
  }, [playersInfo]);

  const handleRemoveFavorite = (playerId: number) => {
    removeFavorite(playerId);
    setData((currentData) =>
      currentData.filter((row) => row.player.id !== playerId)
    );
  };

  const columns = [
    // columnHelper.accessor("player.id", {
    //   cell: (info) => info.getValue(),
    //   header: () => <span>Id</span>,
    // }),
    {
      id: "playerImage",
      cell: (info: CellContext<PlayersStatesRowData, ReactNode>) => (
        <div className="flex justify-center max-h-36 max-w-32 bg-white">
          <Avatar player={info.row.original.player} cutoutImg />
        </div>
      ),
      header: () => <span>Image</span>,
    },
    {
      id: "inSeason",
      cell: (info: CellContext<PlayersStatesRowData, ReactNode>) => (
        <div className="flex justify-center max-h-36 max-w-32">
          {info.row.original.state !== emptyState ? (
            <VscPassFilled color="green" />
          ) : (
            <VscError color="red" />
          )}
        </div>
      ),
      header: () => <span>InSeason</span>,
    },
    columnHelper.accessor("player.first_name", {
      cell: (info) => (
        <HighlightText text={info.getValue()} highlight={queryStr} />
      ),
      header: () => <span>First Name</span>,
    }),
    columnHelper.accessor("player.last_name", {
      cell: (info) => (
        <HighlightText text={info.getValue()} highlight={queryStr} />
      ),
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor((row) => row.state?.pts, {
      id: "pts",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Points</span>,
    }),
    columnHelper.accessor((row) => row.state?.ast, {
      id: "ast",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Assists</span>,
    }),
    columnHelper.accessor((row) => row.state?.reb, {
      id: "reb",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Rebounds</span>,
    }),
    columnHelper.accessor((row) => row.state?.fg_pct, {
      id: "fg_pct",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Field Goal Percentage</span>,
    }),
    columnHelper.accessor((row) => row.state?.games_played, {
      id: "games_played",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Games Played</span>,
    }),
    columnHelper.accessor((row) => row.state?.min, {
      id: "min",
      cell: (info) => info.getValue() || NO_INFO_STR,
      header: () => <span>Minutes Played</span>,
    }),
    columnHelper.accessor((row) => row.state?.stl, {
      id: "stl",
      cell: (info) =>
        info.getValue()
          ? parseFloat(info.getValue() + "").toFixed(1)
          : NO_INFO_STR,
      header: () => <span>Steals</span>,
    }),
    {
      id: "UnFollow",
      cell: (info: CellContext<PlayersStatesRowData, ReactNode>) => (
        <div className="flex justify-center">
          <button
            onClick={() => {
              handleRemoveFavorite(info.row.original.player.id);
            }}
          >
            <MdDeleteForever />
          </button>
        </div>
      ),
      header: () => <span>UnFollow</span>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="my-2 mx-auto w-full">
        <table className="text-center w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="border" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const modalId = `Player_stats_${row.original.player.id}`;

              return (
                <>
                  <Modal
                    modalId={modalId}
                    modalBoxClassName="w-11/12 max-w-5xl"
                  >
                    <PlayerDetails
                      player={row.original.player}
                      stats={row.original.state}
                    />
                  </Modal>
                  <tr
                    key={`table_player_row_${row.original.player.id}`}
                    className="hover:bg-primary hover:text-primary-content cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="border" key={cell.id}>
                        <label htmlFor={modalId}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </label>
                      </td>
                    ))}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
