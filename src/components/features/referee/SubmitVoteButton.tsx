import React, { useCallback } from "react";
import { Peserta } from "../participants/components/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { subMilliseconds } from "date-fns";

type SubmitVoteButtonProps = {
  participants: (Peserta | null)[];
  matchId: string;
};

const SubmitVoteButton = ({ participants, matchId }: SubmitVoteButtonProps) => {
  if (!participants) {
    return <Loader2 className="animate-spin text-blue-500" />;
  }

  const { toast } = useToast();
  const submitWinner = useMutation(api.match.addVoteByWasit);

  const SubmitWasit = useCallback(
    async (id: string) => {
      try {
        await submitWinner({
          matchId: matchId as Id<"match">,
          pesertaId: id as Id<"participants">,
        });
      } catch (error) {
        toast({
          description: "Something Went Wrong",
        });
      }
    },
    [name, submitWinner, toast]
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Submit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Your Winner</DialogTitle>
          <DialogDescription>Please Submit Your Winner!</DialogDescription>
        </DialogHeader>
        {participants && (
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between w-full gap-5 items-center">
              <Button
                className="w-full"
                onClick={() =>
                  SubmitWasit(participants[0]?._id as Id<"participants">)
                }
              >
                {participants[0]?.name}
              </Button>
              <Button
                className="w-full"
                onClick={() =>
                  SubmitWasit(participants[1]?._id as Id<"participants">)
                }
              >
                {participants[1]?.name}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitVoteButton;
