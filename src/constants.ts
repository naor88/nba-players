import { IStats } from "./types";

export const initiateCurser = 0;
export const initiateItemsPerPage = 10;
export const debouncedDelay = 500;

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

export const emptyState: IStats = {
  pts: 0,
  ast: 0,
  turnover: 0,
  pf: 0,
  fga: 0,
  fgm: 0,
  fta: 0,
  ftm: 0,
  fg3a: 0,
  fg3m: 0,
  reb: 0,
  oreb: 0,
  dreb: 0,
  stl: 0,
  blk: 0,
  fg_pct: 0,
  fg3_pct: 0,
  ft_pct: 0,
  min: "",
  games_played: 0,
  player_id: 0,
  season: 0,
};

const FREE_USER_API_KEY = "3";

export const APIs = {
  BallDontLie: "https://api.balldontlie.io/v1",
  TheSportsDB: `https://www.thesportsdb.com/api/v1/json/${FREE_USER_API_KEY}`,
  RoboHash: "https://robohash.org",
};
