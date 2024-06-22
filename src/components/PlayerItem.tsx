import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IPlayer, IStats } from "../types";
import { PlayerAvatar } from "./PlayerAvatar";
import HighlightText from "./HighlightText";
import { Modal } from "./Modal";
import { PlayerDetails } from "./PlayerDetails";
import { useFavorites } from "../hooks/useFavorites";
interface PlayerItemProps {
  player: IPlayer;
  queryStr: string;
  playerState?: IStats;
}

export const PlayerItem = ({ player, queryStr }: PlayerItemProps) => {
  const { isFavorite, handleFavoriteToggle } = useFavorites();
  const modalId = `modal_id_${player.id}`;

  return (
    <>
      <Modal modalId={modalId} modalBoxClassName="w-11/12 max-w-5xl">
        <PlayerDetails player={player} />
      </Modal>
      <div className="grid grid-cols-5 max-h-20">
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
        <div className="col-span-3">
          <label htmlFor={modalId}>
            <div className="cursor-pointer flex items-center">
              <div className="avatar">
                <div className="mask mask-circle w-12 h-12 bg-white">
                  <PlayerAvatar player={player} preferredImageType="cutout" />
                </div>
                <div className="mx-2">
                  <div className="font-bold">
                    <HighlightText
                      text={`${player.first_name} ${player.last_name}`}
                      highlight={queryStr}
                    />
                  </div>
                  <div className="text-sm opacity-50">{player.country}</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};
