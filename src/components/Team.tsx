import { ITeam } from "../types";

export const Team = ({ team }: { team: ITeam }) => {
  return (
    <div key={`team-${team.id}`}>
      <p>{team.full_name}</p>
      <p>{team.name}</p>
      <p>{team.city}</p>
      <p>{team.conference}</p>
      <p>{team.division}</p>
      <p>{team.abbreviation}</p>
    </div>
  );
};
