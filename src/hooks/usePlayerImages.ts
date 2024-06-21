import { useState, useEffect } from "react";
import { IPlayer } from "../types";
import { getPlayerAvatar } from "../utils";

export interface IPlayerImage {
  id: number;
  url: {
    strCutout: string;
    strRender: string;
    strThumb: string;
  } | null;
  loading: boolean;
  error: Error | null;
}

const usePlayerImages = (players: IPlayer[]) => {
  const fetchImages = async () => {
    const newImages = [
      ...players.map(
        (player) =>
          ({
            id: player.id,
            url: null,
            loading: true,
            error: null,
          } as IPlayerImage)
      ),
    ];

    for (const player of players) {
      const imageIndex = newImages.findIndex((img) => img.id === player.id);
      try {
        const imageURLs = await getPlayerAvatar(player);
        newImages[imageIndex] = {
          id: player.id,
          url: imageURLs,
          loading: false,
          error: null,
        };
      } catch (error) {
        newImages[imageIndex] = {
          id: player.id,
          url: null,
          loading: false,
          error: new Error("Failed to fetch player avatar."),
        };
      }
    }

    return newImages;
  };

  return fetchImages();
};

export default usePlayerImages;
