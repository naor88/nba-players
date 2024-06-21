import { ITeam } from "../types";
import { toPascalCaseWithSpaces } from "../utils";

interface TeamDetailsProps {
  className?: string;
  team: ITeam;
}

export const TeamDetails = ({ team, className }: TeamDetailsProps) => {
  return (
    <>      
      <div className="font-bold text-2xl m-4">Team Details</div>
      <div className={`card card-side bg-base-100 shadow-xl ${className}`}>
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
