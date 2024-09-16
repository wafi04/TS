import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { ChangeEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

export type Peserta = {
  _id: Id<"participants">;
  _creationTime: number;
  name: string;
  user: Id<"users">;
  championship: Id<"championship">;
  matchCategory: string;
  contingent: string;
  agree: boolean;
  status: "NOT YET COMPETING" | "WINNER" | "LOSER";
};

export function DialogPeserta({
  name,
  open,
  onClose,
  onOpen,
  MatchId,
}: {
  name: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  MatchId: Id<"match">;
}) {
  const { toast } = useToast();
  const UpdatePeserta = useMutation(api.match.updatePeserta);
  const [selectedPeserta, setSelectedPeserta] = useState<Id<"participants">[]>(
    []
  );
  const handleWasitSelection = (peserta: Id<"participants">) => {
    setSelectedPeserta((prev) =>
      prev.includes(peserta)
        ? prev.filter((id) => id !== peserta)
        : [...prev, peserta]
    );
  };

  async function onSubmit() {
    try {
      await UpdatePeserta({
        matchId: MatchId,
        participants: selectedPeserta,
      });
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  }
  const [msg, setMsg] = useState<string>("");
  const handlesearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value!.trim();
    setMsg(searchTerm);
  };

  const getData = useQuery(api.participants.getPesertaBySearch, {
    kejuaraanName: name,
    name: msg,
  });

  return (
    <>
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find Participants</DialogTitle>
            <DialogDescription>
              Find Participants to add The Match
            </DialogDescription>
          </DialogHeader>
          <SearchPeserta name={name} onSubmit={handlesearch} />
          <DataPeserta
            peserta={getData}
            selectedPeserta={selectedPeserta}
            onChange={handleWasitSelection}
          />
          <span className="flex  justify-end">
            {getData && <Button onClick={() => onSubmit()}>Submit</Button>}
            <Button onClick={onClose}>Close</Button>
          </span>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchPeserta({
  name,
  onSubmit,
}: {
  name: string;
  onSubmit: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <div className="relative ">
        <Input
          name="q"
          placeholder="Search"
          className="pe-10 py-2 bg-accent focus:outline-none"
          onChange={onSubmit}
        />
        <button
          type="submit"
          className="absolute right-3 top-4 size-5 -translate-y-1/2 "
        >
          <SearchIcon className=" transform text-muted-foreground" />
        </button>
      </div>
    </>
  );
}

function DataPeserta({
  peserta,
  selectedPeserta,
  onChange,
}: {
  peserta: Peserta[] | null | undefined;
  selectedPeserta: Id<"participants">[];
  onChange: (peserta: Id<"participants">) => void;
}) {
  if (peserta === undefined) {
    return <SkeletonPeserta />; // Render skeleton saat data belum ada
  }

  if (peserta === null || peserta.length === 0) {
    return <p className="text-center text-gray-500">Peserta Not Found</p>; // Render pesan ketika data tidak ditemukan
  }
  return (
    <>
      {peserta.map((item) => (
        <div
          key={item._id}
          className="bg-card  p-2  rounded-md justify-between flex gap-4"
        >
          <div className="flex space-x-5">
            <div
              className={`w-4 h-4 rounded-full ${
                item.status === "WINNER"
                  ? "bg-green-500"
                  : item.status === "LOSER"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
              title={
                item.status === "WINNER"
                  ? "Winner"
                  : item.status === "LOSER"
                    ? "LOSER"
                    : "Belum Bertanding"
              }
            ></div>
            <p>{item.name}</p>
            <p className="text-gray-700">{item.matchCategory}</p>
            <p className="text-gray-700">{item.contingent}</p>
          </div>
          <Checkbox
            className="size-5 rounded-full"
            checked={selectedPeserta.includes(item._id)}
            onCheckedChange={() => onChange(item._id)}
          />
        </div>
      ))}
    </>
  );
}

function SkeletonPeserta() {
  return (
    <div className="space-y-4">
      {[...Array(1)].map((_, i) => (
        <div
          key={i}
          className="bg-card p-2 rounded-md flex justify-between animate-pulse gap-4"
        >
          <div className="flex space-x-5">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}
