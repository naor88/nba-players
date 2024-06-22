import { fetchPlayerImage } from "../api";
import { APIs } from "../constants";
import { IPlayer } from "../types";

export const getPlayerAvatar = async (
  player: IPlayer
): Promise<{
  strCutout: string;
  strRender: string;
  strThumb: string;
} | null> => {
  const playerImageKey = `player_image_${player.id}`;
  const imageURLs = localStorage.getItem(playerImageKey);
  if (imageURLs) return JSON.parse(imageURLs);

  let imageURL = await fetchPlayerImage(
    `${player.first_name}_${player.last_name}`
  );
  if (!imageURL) {
    imageURL = await fetchPlayerImage(
      `${player.first_name}-${player.last_name}`
    );
  }
  if (!imageURL) {
    // Fallback Where Not found the player at "thesportsdb" API
    const fallBackURL = `${APIs.RoboHash}/${player.first_name} ${player.last_name}.png`;
    imageURL = {
      strCutout: fallBackURL,
      strRender: fallBackURL,
      strThumb: fallBackURL,
    };
  }

  localStorage.setItem(playerImageKey, JSON.stringify(imageURL));

  return imageURL;
};
