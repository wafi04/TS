import React from "react";
import { useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonData } from "./type";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const TableMatch = ({ table }: { table: ButtonData[] }) => {
  const rounds = ["First Round", "Second Round", "Third Round"];

  const ButtonCell = ({
    buttonId,
    value,
  }: {
    buttonId: Id<"keyboard">;
    value: number;
  }) => {
    return <TableCell className="text-center">{value}</TableCell>;
  };

  const getKeyboardsBySide = (side: "Left" | "Right") => {
    const allKeyboards = table.flatMap((round) =>
      round.keyboard.filter((k) => k.side === side).map((k) => k.button)
    );
    return Array.from(new Set(allKeyboards));
  };

  const leftKeyboards = getKeyboardsBySide("Left");
  const rightKeyboards = getKeyboardsBySide("Right");

  const allKeyboardIds = [...leftKeyboards, ...rightKeyboards];
  const keyboardsData = useQuery(api.Keyboard.getKeyboardsByIds, {
    buttons: allKeyboardIds,
  });

  const SideTable = ({ side }: { side: "Left" | "Right" }) => {
    const keyboards = side === "Left" ? leftKeyboards : rightKeyboards;

    if (!keyboardsData) {
      return <Skeleton className="w-full h-48" />;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Round</TableHead>
            {keyboards.map((buttonId, index) => {
              const keyboard = keyboardsData.find((k) => k._id === buttonId);
              return (
                <TableHead key={`${side}-${index}`} className="text-center">
                  {keyboard?.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rounds.map((round, roundIndex) => {
            const roundData = table.find((r) => r.round === round);
            return (
              <TableRow key={roundIndex}>
                <TableCell>{round}</TableCell>
                {keyboards.map((buttonId, index) => {
                  const keyboard = roundData?.keyboard.find(
                    (k) => k.side === side && k.button === buttonId
                  );
                  return (
                    <ButtonCell
                      key={`${side}-${index}`}
                      buttonId={buttonId}
                      value={keyboard?.value || 0}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <SideTable side="Left" />
      </div>
      <div className="flex-1">
        <SideTable side="Right" />
      </div>
    </div>
  );
};

export default TableMatch;
