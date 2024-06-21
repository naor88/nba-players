import { FetchError, IMeta, IPlayer, IStats } from "./types";
import * as ls from "./secureLS";
const API_BASE_URL = "https://api.balldontlie.io/v1";

const getApiKey = (): string | null => {
  return ls.get("apiKey");
};

const getHeaders = (): HeadersInit => {
  // const { apiKey } = useApiKey();
  const apiKey = getApiKey();
  if (!apiKey) {
    const error: FetchError = new Error("Unauthorized") as FetchError;
    error.status = 401;
    throw error;
  }
  return {
    Authorization: apiKey ? apiKey : "",
  };
};

export interface PlayersInfoResponse {
  data: IPlayer[];
  meta: IMeta;
}

export interface StatsResponse {
  data: IStats[];
}

const buildPlayerQuery = (favorites: number[]) =>
  favorites.map((id) => `player_ids[]=${id}`).join("&");

export const validateApiKeyAPI = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/players`, {
      headers: { Authorization: apiKey },
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const fetchPlayersData = async (
  nextCursor: number,
  itemsPerPage: number,
  queryStr?: string,
  favorites?: number[]
): Promise<PlayersInfoResponse | undefined> => {
  let queryString = `cursor=${nextCursor}&per_page=${itemsPerPage}`;

  if (queryStr) {
    queryString += `&search=${queryStr}`;
  }

  if (favorites && favorites.length > 0) {
    const favoritesQuery = buildPlayerQuery(favorites);
    queryString += `&${favoritesQuery}`;
  }

  const response = await fetch(`${API_BASE_URL}/players?${queryString}`, {
    headers: getHeaders(),
  });

  if (response.status === 200) {
    const { data, meta } = await response.json();
    return { data, meta };
  }

  throwFetchError(response);
};

export const fetchPlayersStats = async (
  nextCursor: number,
  itemsPerPage: number,
  queryStr?: string,
  favorites?: number[]
): Promise<StatsResponse | undefined> => {
  let queryString = `cursor=${nextCursor}&per_page=${itemsPerPage}`;

  if (queryStr) {
    queryString += `&search=${queryStr}`;
  }

  if (favorites && favorites.length > 0) {
    const favoritesQuery = buildPlayerQuery(favorites);
    queryString += `&${favoritesQuery}`;
  }

  const previousSeasonYear = new Date().getFullYear() - 1;
  const response = await fetch(
    `${API_BASE_URL}/season_averages?season=${previousSeasonYear}&?${queryString}`,
    {
      headers: getHeaders(),
    }
  );

  if (response.status === 200) {
    const { data } = await response.json();
    return { data };
  }

  throwFetchError(response);
};

export const fetchPlayerImage = async (
  playerName: string
): Promise<{
  strCutout: string;
  strRender: string;
  strThumb: string;
} | null> => {
  const FREE_USER_API_KEY = "3";
  const url = `https://www.thesportsdb.com/api/v1/json/${FREE_USER_API_KEY}/searchplayers.php?p=${playerName}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.player && data.player.length > 0) {
      return {
        strThumb: data.player[0].strThumb,
        strCutout: data.player[0].strCutout,
        strRender: data.player[0].strRender,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

function throwFetchError(response: Response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    throw new FetchError("Too Many Requests", 429, retryAfter || undefined);
  }

  if (response.status === 401) {
    throw new FetchError("Unauthorized", 401);
  }

  if (response.status === 403) {
    throw new FetchError("Forbidden", 403);
  }

  if (response.status === 404) {
    throw new FetchError("Not Found", 404);
  }

  if (response.status === 406) {
    throw new FetchError("Not Acceptable", 406);
  }

  if (response.status === 500) {
    throw new FetchError("Internal Server Error", 500);
  }

  if (response.status === 503) {
    throw new FetchError("Service Unavailable", 503);
  }

  throw new FetchError("Failed to fetch player data", response.status);
}
