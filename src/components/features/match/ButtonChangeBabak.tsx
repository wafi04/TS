"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChangeBabak } from "@/hooks/useRounds";

export function ListBabak() {
  const { babak, setBabak } = ChangeBabak();

  const isLastRound = useMemo(() => babak === "Third Round", [babak]);
  const isFirstRound = useMemo(() => babak === "First Round", [babak]);

  const handleChangeBabak = useCallback(
    (direction: "next" | "prev") => {
      const babakOrder: Array<"First Round" | "Second Round" | "Third Round"> =
        ["First Round", "Second Round", "Third Round"];
      const currentBabakIndex = babakOrder.indexOf(babak);

      let newBabakIndex: number;
      if (direction === "next") {
        newBabakIndex =
          currentBabakIndex < babakOrder.length - 1
            ? currentBabakIndex + 1
            : currentBabakIndex;
      } else {
        newBabakIndex =
          currentBabakIndex > 0 ? currentBabakIndex - 1 : currentBabakIndex;
      }

      setBabak(babakOrder[newBabakIndex]);
    },
    [babak, setBabak]
  );

  const getBabakColor = (round: string) => {
    switch (round) {
      case "First Round":
        return "bg-blue-500";
      case "Second Round":
        return "bg-green-500";
      case "Third Round":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center   rounded-lg shadow-lg">
      <div className="flex gap-4 items-center">
        <Button
          className={`p-2 rounded-full transition-all duration-300 ${
            isFirstRound ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
          onClick={() => handleChangeBabak("prev")}
          disabled={isFirstRound}
        >
          <ArrowLeft size={24} />
        </Button>
        <div
          className={`text-md px-4 py-2 items-center flex font-extrabold  rounded-full text-white ${getBabakColor(babak)}`}
        >
          {babak}
        </div>
        <Button
          className={`p-2 rounded-full transition-all duration-300 ${
            isLastRound ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
          onClick={() => handleChangeBabak("next")}
          disabled={isLastRound}
        >
          <ArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
}
