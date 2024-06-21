import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useFavorites } from "../context/FavoritesContext";
import { IPlayer, IStats } from "../types";
import { toPascalCaseWithSpaces } from "../utils";
import Avatar from "./Avatar";
import { TeamDetails } from "./TeamDetails";
import { StatsDetails } from "./StatsDetails";

interface PlayerDetailsProps {
  player: IPlayer;
  stats?: IStats;
}

export const PlayerDetails = ({ player, stats }: PlayerDetailsProps) => {
  const { handleFavoriteToggle, isFavorite } = useFavorites();
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-row justify-between">
        <div className="font-bold text-2xl mb-4">Player Details</div>
        <div
          className="cursor-pointer col-span-2"
          onClick={() => {
            handleFavoriteToggle(player.id);
          }}
        >
          {isFavorite(player.id) ? (
            <MdFavorite color="red" size={30} />
          ) : (
            <MdFavoriteBorder size={30} />
          )}
        </div>
      </div>
      <div className="card card-side bg-base-100 shadow-xl flex border">
        <figure className="flex flex-col items-center bg-white p-4 space-y-4">
          <Avatar className="w-52 h-52" player={player} cutoutImg />
          <Avatar className="w-52 h-52" player={player} renderImg />
          <Avatar className="w-52 h-52" player={player} thumbImg />
        </figure>
        <div className="card-body p-4">
          {(Object.keys(player) as Array<keyof IPlayer>).map((key) => {
            if (key == "team") return null;
            return (
              <div
                className="grid grid-cols-2 gap-4 py-1 hover:bg-primary"
                key={key as string}
              >
                <div className="font-semibold text-lg">
                  {toPascalCaseWithSpaces((key as string).replace("_", " "))}
                </div>
                <div className="text-lg">{player[key] || "N/A"}</div>
              </div>
            );
          })}
        </div>
      </div>
      {stats && <StatsDetails className="mt-4 border" stats={stats} />}
      <TeamDetails className="mt-4 border" team={player["team"]} />
    </div>
  );
};
