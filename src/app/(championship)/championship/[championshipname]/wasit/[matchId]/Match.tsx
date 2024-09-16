"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import Header from "@/components/features/championship/components/Header";
import TableMatch from "@/components/features/match/tableMatch";
import { Keyboard } from "@/components/features/match/keyboard";
import { ListBabak } from "@/components/features/match/ButtonChangeBabak";
import { Button } from "@/components/ui/button";
import SubmitVoteButton from "@/components/features/referee/SubmitVoteButton";

const Match = ({ matchId, name }: { matchId: Id<"match">; name: string }) => {
  const tableData = useQuery(api.matchScore.getData, {
    matchId,
  });

  if (!tableData || tableData.referees === null) {
    return;
  }
  const { referees, currentReferee, matchScore, participants } = tableData;
  console.log(referees);
  return (
    <div className="space-y-3">
      {referees.filteredReferees && referees.filteredReferees.length > 0 && (
        <Header title={`WASIT KE ${referees.refereeNumber}`} backs={true}>
          <ListBabak />
        </Header>
      )}
      {participants && (
        <div className="flex justify-between items-center gap-2">
          <h4 className="border-2 bg-blue-500 px-4 py-2 text-center rounded-md w-full">
            <span>{tableData.participants[0]?.name}</span>
          </h4>
          <h4 className="border-2 text-center bg-yellow-500 px-4 py-2  rounded-md w-full">
            <span>{tableData.participants[1]?.name}</span>
          </h4>
        </div>
      )}
      {matchScore.rounds && (
        <div className="flex flex-col">
          <TableMatch table={tableData.matchScore.rounds} />
          {tableData && <Keyboard matchId={matchId} name={name} />}
        </div>
      )}
      {participants && (
        <SubmitVoteButton participants={participants} matchId={matchId} />
      )}
    </div>
  );
};

export default Match;
