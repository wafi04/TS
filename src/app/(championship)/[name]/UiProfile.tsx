"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { User, Settings } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import ButtonEditProfile from "@/components/features/profile/ButtonProfile";

const UiProfile = ({ name }: { name: string }) => {
  const user = useQuery(api.users.getUserByname, { name });
  const participants = useQuery(api.participants.getParticipantsByUser, {
    userId: user?._id as Id<"users">,
  });
  const championships = useQuery(api.championship.getChampionshipsByUser, {
    userId: user?._id as Id<"users">,
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalWins =
    participants?.filter((p) => p.status === "WINNER").length || 0;
  const totalParticipations = participants?.length || 0;

  return (
    <div className="max-w-3xl w-full mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">{user.name}</h1>
        <ButtonEditProfile user={user} />
      </div>

      {/* Profile Info */}
      <div className="flex mb-6">
        <div className="mr-8">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {user.image ? (
              <Image
                src={user.image as string}
                alt={user.name as string}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center ">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-grow">
          <div className="mb-2">
            <h2 className="text-lg font-semibold">
              {user.displayName || user.name}
            </h2>
            <p className="text-sm text-blue-600 font-semibold">{user.role}</p>
          </div>
          <div className="flex justify-between ">
            <div className="text-center">
              <div className="font-bold">{totalParticipations}</div>
              <div className="text-sm text-gray-500">Participations</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{totalWins}</div>
              <div className="text-sm text-gray-500">Wins</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{championships?.length || 0}</div>
              <div className="text-sm text-gray-500">Championships</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-gray-700">{user.bio || "No bio available"}</p>
      </div>

      {/* Championships */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Championships</h3>
        <div className="space-y-2">
          {championships?.map((champ) => (
            <div key={champ._id} className="bg-secondary p-3 rounded-md">
              <h4 className="font-medium">{champ.name}</h4>
              <p className="text-sm text-gray-600">{champ.location}</p>
              <p className="text-sm text-gray-600">
                {new Date(champ.startDate).toLocaleDateString()} -
                {new Date(champ.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UiProfile;
