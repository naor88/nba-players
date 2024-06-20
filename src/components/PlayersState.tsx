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

export type PlayersStatesRowData = {
  player: IPlayer;
  state: IStats;
};

const columnHelper = createColumnHelper<PlayersStatesRowData>();

interface PlayersStatesProps {
  playersInfo: PlayersStatesRowData[];
}

export const PlayersStates = ({ playersInfo }: PlayersStatesProps) => {
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
    columnHelper.accessor("player.id", {
      cell: (info) => info.getValue(),
      header: () => <span>Id</span>,
    }),
    {
      id: "playerImage",
      cell: (info: CellContext<PlayersStatesRowData, ReactNode>) => (
        <div className="flex justify-center max-h-36 max-w-32">
          <Avatar player={info.row.original.player} />
        </div>
      ),
      header: () => <span>Image</span>,
    },
    columnHelper.accessor("player.first_name", {
      cell: (info) => info.getValue(),
      header: () => <span>First Name</span>,
    }),
    columnHelper.accessor("player.last_name", {
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor((row) => row.state?.pts, {
      id: "pts",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Points</span>,
    }),
    columnHelper.accessor((row) => row.state?.ast, {
      id: "ast",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Assists</span>,
    }),
    columnHelper.accessor((row) => row.state?.reb, {
      id: "reb",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Rebounds</span>,
    }),
    columnHelper.accessor((row) => row.state?.fg_pct, {
      id: "fg_pct",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Field Goal Percentage</span>,
    }),
    columnHelper.accessor((row) => row.state?.games_played, {
      id: "games_played",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Games Played</span>,
    }),
    columnHelper.accessor((row) => row.state?.min, {
      id: "min",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Minutes Played</span>,
    }),
    columnHelper.accessor((row) => row.state?.stl, {
      id: "stl",
      cell: (info) => parseFloat(info.getValue() + "").toFixed(1) || "N/A",
      header: () => <span>Steals</span>,
    }),
    {
      id: "UnFollow",
      cell: (info: CellContext<PlayersStatesRowData, ReactNode>) => (
        <div className="flex justify-center">
          <button
            onClick={() => {
              // console.log(`UnFollow`, info.row.original.player.id);
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
    <div className="my-2 mx-auto">
      <table className="text-center">
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={`table_player_row_${row.original.player.id}`}
              className="hover:bg-primary hover:text-primary-content cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <td className="border" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
