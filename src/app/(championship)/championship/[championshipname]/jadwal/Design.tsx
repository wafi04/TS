"use client";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useState } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Clock, MapPin, Trophy, User } from "lucide-react";
import { format } from "date-fns";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/features/championship/components/Header";
import { UpdateDataMatchs } from "@/components/features/match/dialog/ToggleDIalog";
import Link from "next/link";
import { FilterByBagan } from "@/components/features/championship/components/filterByClass";
import { useToast } from "@/components/ui/use-toast";
import { boolean } from "zod";

export interface Match {
  _id: Id<"match">;
  time: number;
  location: string;
  round: number;
  referee?: Array<Id<"referee">> | undefined;
  matchNumber: number;
  aggree: boolean;
  participants: Array<{
    _id: Id<"participants">;
    name: string;
    referee?: Id<"referee">[];
    votes?: {
      wasitId: Id<"referee">;
      pesertaId: Id<"participants">;
      voteCount: number;
    }[];
  } | null>;
  winner?: Id<"participants">;
}

interface PropsJadwal {
  isShow: boolean;
  match: Match[] | undefined;
  name: string;
  isAll: boolean;
}

const DesignJadwalPage = ({ isShow, match, name, isAll }: PropsJadwal) => {
  if (!match) {
    return <Matchesss />;
  }
  return (
    <div className="container w-full h-screen">
      <Header title="Schedule Match" backs={true}>
        <div className="flex gap-4 items-center">
          <FilterByBagan />
          {!isAll && isShow && (
            <Link
              href={`/championship/${name}/jadwal/all`}
              className="p-2 border-2 rounded-md font-bebas"
            >
              See All
            </Link>
          )}
        </div>
      </Header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {match.map((match) => (
          <MatchCard
            key={match._id}
            match={match}
            name={name}
            isAll={isAll}
            isShow={isShow}
          />
        ))}
      </div>
    </div>
  );
};

const MatchCard = ({
  match,
  name,
  isAll,
  isShow,
}: {
  match: Match;
  name: string;
  isAll: boolean;
  isShow: boolean;
}) => {
  const participant1 = match.participants[0];
  const participant2 = match.participants[1];

  return (
    <div className="bg-secondary group shadow-lg rounded-lg  mt-5 overflow-hidden">
      <div className="bg-blue-600 text-white py-2 px-4 flex items-center justify-between">
        <h2 className="text-xl  font-bebas ">
          Round {match.round} - Match {match.matchNumber}
        </h2>
        {isAll && isShow && (
          <UpdateDataMatchs idMatch={match._id} name={name} match={match} />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="mr-2" size={18} />
            <span>{format(new Date(match.time), "dd MMM yyyy HH:mm")}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2" size={18} />
            <span>{match.location}</span>
          </div>
        </div>
        {participant1 && participant2 && (
          <div className="flex justify-between items-center mb-4">
            <Participant
              name={participant1 && participant1.name}
              isWinner={match.winner === participant1?._id}
            />
            <span className="text-md font-bold">VS</span>
            <Participant
              name={participant2 && participant2.name}
              isWinner={match.winner === participant2?._id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Participant = ({
  name,
  isWinner,
}: {
  name: string;
  isWinner?: boolean;
}) => (
  <div
    className={`flex items-center ${isWinner ? "text-green-600 font-bold" : ""}`}
  >
    <User className="mr-2" size={18} />
    <span>{name}</span>
    {isWinner && <Trophy className="ml-2" size={18} />}
  </div>
);
export default DesignJadwalPage;

const Matchesss = () => {
  return (
    <div className="container h-screen w-full flex- justify-center ">
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <MatchCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
};

const MatchCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="bg-secondary shadow-lg rounded-lg mt-5 overflow-hidden ">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function UpdateMatches({
  idMatch,
  isActive,
}: {
  idMatch: Id<"match">;
  isActive: boolean;
}) {
  const update = useMutation(api.match.updateMatches);
  const { toast } = useToast();
  const [isOn, setIsOn] = useState(isActive);
  const handleUpdate = useCallback(
    async (newState: boolean) => {
      try {
        await update({
          match: idMatch,
          isActive: newState,
        });
        setIsOn(newState);
      } catch (error) {
        toast({
          description: "Something Went Wrong",
        });
      }
    },
    [toast, update, idMatch]
  );
  return (
    <>
      <Switch
        checked={isOn}
        onCheckedChange={handleUpdate}
        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200 "
      />
    </>
  );
}
