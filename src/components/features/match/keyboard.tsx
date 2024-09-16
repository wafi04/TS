"use client";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { ChangeBabak } from "@/hooks/useRounds";

export const Keyboard = ({
  name,
  matchId,
}: {
  name: string;
  matchId: Id<"match">;
}) => {
  const { babak } = ChangeBabak();
  const { user: me } = useUser();
  const [scores, setScores] = useState<Record<string, number>>({});
  const Sum = useMutation(api.matchScore.upsertTableMatch);
  const dataLeft =
    useQuery(api.Keyboard.getKeyboardLeft, {
      championship: name,
    }) || [];
  const dataRight =
    useQuery(api.Keyboard.getKeyboardRight, {
      championship: name,
    }) || [];

  const handleClick = useCallback(
    async (id: string, value: number, side: "Right" | "Left") => {
      setScores((prevScores) => {
        const newScore = (prevScores[id] || 0) + value;
        Sum({
          matchId: matchId,
          round: babak,
          keyboardId: id as Id<"keyboard">,
          value: newScore,
          side: side,
        })
          .then(() => {})
          .catch((error) => {
            toast({
              description: "Error updating",
            });
          });

        return { ...prevScores, [id]: newScore };
      });
    },
    [Sum, matchId, babak]
  );

  if (dataRight === null || dataLeft === null) {
    return <Loader2 />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
        {dataLeft?.map((item) => (
          <Button
            key={item._id}
            onClick={() => handleClick(item._id, item.value, "Left")}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
        {dataRight?.map((item) => (
          <Button
            key={item._id}
            onClick={() => handleClick(item._id, item.value, "Right")}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
