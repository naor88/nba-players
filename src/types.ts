export interface IPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: ITeam;
}
export interface ITeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface IMeta {
  prev_cursor: number;
  next_cursor: number;
  per_page: number;
}

export interface IStats {
  pts: number;
  ast: number;
  turnover: number;
  pf: number;
  fga: number;
  fgm: number;
  fta: number;
  ftm: number;
  fg3a: number;
  fg3m: number;
  reb: number;
  oreb: number;
  dreb: number;
  stl: number;
  blk: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  min: string;
  games_played: number;
  player_id: number;
  season: number;
}


export interface PlayersInfoResponse {
  data: IPlayer[];
  meta: IMeta;
}

export interface StatsResponse {
  data: IStats[];
}

export class FetchError extends Error {
  status: number;
  retryAfter?: string;

  constructor(message: string, status: number, retryAfter?: string) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    if (retryAfter) {
      this.retryAfter = retryAfter;
    }
  }
}