"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
export function DialogWasit({
  namaKejuaraan,
  open,
  onClose,
  onOpen,
  MatchId,
}: {
  namaKejuaraan: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  MatchId: Id<"match">;
}) {
  const { toast } = useToast();
  const data = useQuery(api.referee.getWasitForChampionship, {
    kejuaraanName: namaKejuaraan,
  });
  const updateWasit = useMutation(api.match.updateWasit);

  const [selectedWasit, setSelectedWasit] = useState<Id<"referee">[]>([]);
  const handleWasitSelection = (wasitId: Id<"referee">) => {
    setSelectedWasit((prev) =>
      prev.includes(wasitId)
        ? prev.filter((id) => id !== wasitId)
        : [...prev, wasitId]
    );
  };

  async function onSubmit() {
    try {
      await updateWasit({
        matchId: MatchId,
        wasitId: selectedWasit,
      });
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Referee</DialogTitle>
            <DialogDescription>
              Modify the referee assigned to this match.
            </DialogDescription>
          </DialogHeader>
          {data?.map((referee) => (
            <div
              key={referee._id}
              className="bg-card p-2  space-y-2 rounded-md flex justify-between items-center gap-4 relative"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={referee.userDetails?.image || "/default-avatar.png"}
                  alt="Wasit Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p>{referee.userDetails?.name}</p>
                  <p className="text-gray-700">{referee.userDetails?.email}</p>
                </div>
              </div>
              <Checkbox
                className="size-5 rounded-full"
                checked={selectedWasit.includes(referee._id)}
                onCheckedChange={() => handleWasitSelection(referee._id)}
              />
            </div>
          ))}
          <DialogFooter>
            <Button
              onClick={() => onSubmit()}
              variant={"outline"}
              className="bg-accent"
            >
              Submit
            </Button>
            <Button onClick={onClose} variant={"ghost"} className="bg-card">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
