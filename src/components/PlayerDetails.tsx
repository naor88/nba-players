import { IPlayer } from "../types";
import { toPascalCaseWithSpaces } from "../utils";
import Avatar from "./Avatar";
import { TeamDetails } from "./TeamDetails";

interface PlayerDetailsProps {
  player: IPlayer;
}

export const PlayerDetails = ({
  player,
}: PlayerDetailsProps) => {
  return (
    <>
      <div className="font-bold w-full">Player Full Details</div>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure className="w-52">
          <Avatar player={player} />
        </figure>
        <div className="card-body w-96">
          {(Object.keys(player) as Array<keyof IPlayer>).map((key) => {
            if (key == "team") return;
            return (
              <div className="grid grid-cols-2" key={key as string}>
                <div>
                  {toPascalCaseWithSpaces((key as string).replace("_", " "))}
                </div>
                <div>{player[key]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <TeamDetails team={player["team"]} />
    </>
  );
};
