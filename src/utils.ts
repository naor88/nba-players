import { fetchPlayerImage } from "./api";
import { IPlayer } from "./types";

export const initiateCurser = 0;
export const initiateItemsPerPage = 10;
export const debouncedDelay = 500;

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
    const fallBackURL = `https://robohash.org/${player.first_name} ${player.last_name}.png`;
    imageURL = {
      strCutout: fallBackURL,
      strRender: fallBackURL,
      strThumb: fallBackURL,
    };
  }

  localStorage.setItem(playerImageKey, JSON.stringify(imageURL));

  return imageURL;
};

export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

export const toPascalCase = (str: string): string => {
  return str
    .replace(
      /(\w)(\w*)/g,
      (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
    )
    .replace(/[^a-zA-Z0-9]/g, "");
};

export const toPascalCaseWithSpaces = (str: string): string => {
  return str.replace(
    /(\w)(\w*)/g,
    (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase()
  );
};

type IndexedObject = {
  [key: string]: any;
};

export function sortByIdList<T extends IndexedObject>(
  items: T[],
  idList: number[],
  key: string
): T[] {
  const getNestedValue = (obj: T, path: string): any => {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  };

  return items.sort((a, b) => {
    const aValue = getNestedValue(a, key);
    const bValue = getNestedValue(b, key);
    return idList.indexOf(aValue) - idList.indexOf(bValue);
  });
}

export const statsMeaningMapping = {
  pts: "Points",
  ast: "Assists",
  turnover: "Turnovers",
  pf: "Personal Fouls",
  fga: "Field Goals Attempted",
  fgm: "Field Goals Made",
  fta: "Free Throws Attempted",
  ftm: "Free Throws Made",
  fg3a: "Three-Point Field Goals Attempted",
  fg3m: "Three-Point Field Goals Made",
  reb: "Rebounds",
  oreb: "Offensive Rebounds",
  dreb: "Defensive Rebounds",
  stl: "Steals",
  blk: "Blocks",
  fg_pct: "Field Goal Percentage",
  fg3_pct: "Three-Point Field Goal Percentage",
  ft_pct: "Free Throw Percentage",
  min: "Minutes",
  games_played: "Games Played",
  player_id: "Player ID",
  season: "Season",
};
