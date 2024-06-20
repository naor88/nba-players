import { ITeam } from "../types";
import { toPascalCaseWithSpaces } from "../utils";

interface TeamDetailsProps {
  team: ITeam;
}

export const TeamDetails = ({ team }: TeamDetailsProps) => {
  return (
    <>
      Team Details
      <div className="card card-side bg-base-100 shadow-xl">
        <div className="card-body w-96">
          {(Object.keys(team) as Array<keyof ITeam>).map((key) => {
            return (
              <div className="grid grid-cols-2" key={key as string}>
                <div>
                  {toPascalCaseWithSpaces((key as string).replace("_", " "))}
                </div>
                <div>{team[key]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
