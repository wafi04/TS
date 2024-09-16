"use client";
import Header from "@/components/features/championship/components/Header";
import React from "react";
import TableLiveScore from "./tableLiveScore";
import { FilterByBagan } from "@/components/features/championship/components/filterByClass";
import { FilterPertandingan } from "@/components/features/match/filterMatch";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { ClientOnly, DataLength } from "@/components/ui/notfound";

const Livescore = ({
  name,
  matchId,
}: {
  name: string;
  matchId?: Id<"match"> | undefined;
}) => {
  return (
    <>
      <Header title="Live Score" className="mb-4" backs={true}>
        <FilterPertandingan name={name} />
      </Header>
      {matchId ? (
        <TableLiveScore name={name} matchId={matchId} />
      ) : (
        <ClientOnly>
          <DataLength text="Select Match" className="h-[400px]" />
        </ClientOnly>
      )}
    </>
  );
};

export default Livescore;
