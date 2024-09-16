"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import { ClientOnly, DataLength } from "@/components/ui/notfound";
import Header from "@/components/features/championship/components/Header";
import { UpdateDataMatchs } from "@/components/features/match/dialog/ToggleDIalog";

interface Match {
  matchId: Id<"match">;
  nextMatchId?: string;
  position?: "TOP" | "BOTTOM";
}

interface Round {
  roundNumber: number;
  matches: Match[];
}

export interface Bracket {
  _creationTime: number;
  _id: string;
  championship: string;
  class: string;
  rounds: Round[];
}

interface TournamentBracketProps {
  kejuaraanName: string;
}

interface BracketForKelasProps {
  bracket: Bracket;
  name: string;
}

interface RoundViewProps {
  round: Round;
  roundIndex: number;
  name: string;
}
interface MatchViewProps {
  matchId: Id<"match">;
  name: string;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  kejuaraanName,
}) => {
  const params = useSearchParams();
  const kelasTanding = params.get(decodeURIComponent("kelasTanding")) ?? "A PA";
  const brackets = useQuery(api.brackets.getBrackets, {
    kejuaraanName,
    kelasTanding,
  });
  if (!brackets) return <BracketSkeleton />;

  console.log(brackets);
  if (brackets.length === 0) {
    return (
      <ClientOnly>
        <DataLength text="Not data Found" className="h-[200px] space-y-10" />
      </ClientOnly>
    );
  }

  return (
    <div className="container w-full h-screen">
      {brackets.length > 0 && <Header title="Brackets" />}
      {brackets.map((bracket) => (
        <BracketForKelas
          key={bracket._id}
          bracket={bracket}
          name={kejuaraanName}
        />
      ))}
    </div>
  );
};

const BracketForKelas: React.FC<BracketForKelasProps> = ({ bracket, name }) => {
  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold   font-bebas">{bracket.class}</h2>
      <div className="flex">
        {bracket.rounds.map((round, roundIndex) => (
          <RoundView
            key={round.roundNumber}
            round={round}
            roundIndex={roundIndex}
            name={name}
          />
        ))}
      </div>
    </div>
  );
};

const RoundView: React.FC<RoundViewProps> = ({ round, roundIndex, name }) => {
  const matchCount = round.matches.length;
  const spacing = Math.pow(2, roundIndex + 1) * 32;

  return (
    <div className="flex flex-col" style={{ marginRight: "40px" }}>
      <h3 className="text-lg font-medium mb-4">Round {round.roundNumber}</h3>
      <div
        className="flex flex-col gap-2 justify-around"
        style={{ height: `${spacing * matchCount}px` }}
      >
        {round.matches.map((match, index) => (
          <div
            key={match.matchId}
            style={{ marginTop: index > 0 ? `${spacing - 64}px` : "0" }}
          >
            <MatchView matchId={match.matchId} name={name} />
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchView: React.FC<MatchViewProps> = ({ matchId, name }) => {
  const me = useQuery(api.users.currentUser);
  const kejuaraan = useQuery(api.championship.getKejuaraanByName, {
    name,
  });
  const matchDetails = useQuery(api.brackets.getMatchDetails, { matchId });

  if (!matchDetails) return <MatchSkeleton />;

  return (
    <div className="bg-secondary rounded-md shadow-md p-4 mb-4 w-64  relative  group">
      <div className="flex flex-col gap-2">
        <Participant
          name={matchDetails.peserta[0]?.name ?? "Menunggu Pemenang"}
          isWinner={matchDetails.winner === matchDetails.peserta[0]?._id}
        />
        <div className="border-t border-gray-300 my-2"></div>
        <Participant
          name={matchDetails.peserta[1]?.name || "Menunggu Pemenang"}
          isWinner={matchDetails.winner === matchDetails.peserta[1]?._id}
        />
      </div>
      {kejuaraan?.user === me?._id && (
        <span className="absolute top-0 right-3  invisible  group-hover:visible">
          <UpdateDataMatchs idMatch={matchId} name={name} />
        </span>
      )}
    </div>
  );
};

interface ParticipantProps {
  name: string;
  isWinner: boolean;
}

const Participant: React.FC<ParticipantProps> = ({ name, isWinner }) => {
  return (
    <span
      className={`p-2 text-sm font-medium rounded bg-background ${
        isWinner ? " text-green-800" : " text-gray-200"
      }`}
    >
      {name}
      {isWinner && <span className="ml-2 text-xs">Winner</span>}
    </span>
  );
};

function BracketSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <Skeleton className="h-10 w-2/3 mx-auto mb-8" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2].map((j) => (
                <div key={j}>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((k) => (
                      <Card key={k} className="shadow">
                        <CardHeader>
                          <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MatchSkeleton() {
  return (
    <Card className="shadow">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export default TournamentBracket;
