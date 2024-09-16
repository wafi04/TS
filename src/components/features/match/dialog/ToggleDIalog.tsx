"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DialogPeserta } from "./DialogPeserta";
import { DialogWasit } from "./Dialogwasit";
import { DialogEdit } from "./DialogMatch";
import {
  Match,
  UpdateMatches,
} from "@/app/(championship)/championship/[championshipname]/jadwal/Design";

export function UpdateDataMatchs({
  idMatch,
  match,
  name,
}: {
  idMatch: Id<"match">;
  match?: Match;
  name: string;
}) {
  const [data, setData] = useState<boolean>(false);
  const [openWasit, setOpenWasit] = useState(false);
  const [openPeserta, setOpenPeserta] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="invisible  group-hover:visible group-hover:bg-secondary"
          >
            <Ellipsis className="size-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {match && (
            <DropdownMenuItem className="flex items-center justify-between">
              <span className="text-green-500">Change</span>
              <UpdateMatches idMatch={match._id} isActive={match.aggree} />
            </DropdownMenuItem>
          )}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 text-blue-600">
              <Edit2 className="size-4" />
              <span>Edit</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setOpenWasit(true)}>
                Edit Wasit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setData(true)}>
                Edit Match
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setOpenPeserta(true)}>
                Edit Peserta
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {data && (
        <DialogEdit
          open={data}
          MatchId={idMatch}
          onClose={() => setData(false)}
          onOpen={() => setData(false)}
        />
      )}
      {openWasit && (
        <DialogWasit
          open={openWasit}
          namaKejuaraan={name}
          MatchId={idMatch}
          onClose={() => setOpenWasit(false)}
          onOpen={() => setOpenWasit(false)}
        />
      )}
      {openPeserta && (
        <DialogPeserta
          open={openPeserta}
          name={name}
          MatchId={idMatch}
          onClose={() => setOpenPeserta(false)}
          onOpen={() => setOpenPeserta(false)}
        />
      )}
    </>
  );
}
