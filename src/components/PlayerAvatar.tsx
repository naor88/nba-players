import usePlayerImages from "../hooks/usePlayerImages";
import { IPlayer } from "../types";
import { Avatar } from "./Avatar";

interface PlayerAvatarProps {
  player: IPlayer;
  className?: string;
  preferredImageType?: 'cutout' | 'render' | 'thumb';
}

export const PlayerAvatar = ({
  player,
  className,
}: PlayerAvatarProps ) => {
  const { url, loading, error } = usePlayerImages(player);
  let altText = `${player.first_name} ${player.last_name}`;
  if (loading) altText = `loading ` + altText;
  if (error) altText = `error ` + altText;
  return <Avatar className={className} imageUrl={url} alt={altText} />;
};
