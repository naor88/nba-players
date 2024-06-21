import { IStats } from "../types";
import { statsMeaningMapping, toPascalCaseWithSpaces } from "../utils";
import { emptyState } from "./PlayersDialog";

interface StatsDetailsProps {
  className?: string;
  stats: IStats;
}

export const StatsDetails = ({ stats, className }: StatsDetailsProps) => {
  return (
    <>
      <div className="font-bold text-2xl m-4">
        Last Season Statistic Details
      </div>
      <div className={`card card-side bg-base-100 shadow-xl ${className}`}>
        {stats !== emptyState ? (
          <div className="card-body w-96">
            {(Object.keys(stats) as Array<keyof IStats>).map((key) => {
              return (
                <div
                  className="grid grid-cols-2 hover:bg-primary text-start"
                  key={key as string}
                >
                  <div>{statsMeaningMapping[`${key}`]}</div>
                  <div>{stats[key]}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mx-auto">
            No Player Statistic For Last Season
          </div>
        )}
      </div>
    </>
  );
};
