import { IPlayer, IStats } from "../types";
import { PlayerItem } from "./PlayerItem";

interface PlayerListProps {
  players: IPlayer[];
  queryStr: string;
  playersState?: IStats[];
}
export const PlayerList = ({
  players,
  queryStr,
  playersState,
}: PlayerListProps) => {
  return (
    <div className="container p-4 max-w-96">
      <div>
        <div className="grid grid-cols-5 mb-3 font-bold">
          <div className="col-span-2">Favorite</div>
          <div className="col-span-3">Player</div>
        </div>
        {players?.map((player) => {
          const playerState = playersState?.find(
            (state) => state.player_id == player.id
          );
          return (
            <PlayerItem
              key={`player-${player.id}`}
              player={player}
              queryStr={queryStr}
              playerState={playerState}
            />
          );
        })}
      </div>
    </div>
  );
};
