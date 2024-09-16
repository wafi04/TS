"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type BabakName = "First Round" | "Second Round" | "Third Round";

const TableLiveScore = ({
  name,
  matchId,
}: {
  name: string;
  matchId: Id<"match">;
}) => {
  const matchData = useQuery(api.referee.getMatchDataWithWasitAndTableMatch, {
    matchId,
  });
  const babak: BabakName[] = ["First Round", "Second Round", "Third Round"];
  if (!matchData) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <Table className="mb-8">
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-center px-2 py-3 text-white">
                <Skeleton className="h-6 w-20" />
              </TableHead>
              {[1, 2, 3, 4].map((i) => (
                <TableHead key={i} className="text-center px-2 py-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {babak.map((babakName, index) => (
              <TableRow key={index} className="text-white hover:bg-gray-700">
                <TableCell className="px-2 py-3 text-center font-medium">
                  <Skeleton className="h-6 w-28" />
                </TableCell>
                {[1, 2, 3, 4].map((i) => (
                  <TableCell key={i} className="text-center px-2 py-3">
                    <Skeleton className="h-6 w-8 mx-auto" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="text-white font-bold bg-gray-800">
              <TableCell className="px-2 py-3 text-center">
                <Skeleton className="h-6 w-16" />
              </TableCell>
              {[1, 2, 3, 4].map((i) => (
                <TableCell key={i} className="text-center px-2 py-3">
                  <Skeleton className="h-6 w-8 mx-auto" />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <Table className="mb-8">
        <TableHeader>
          <TableRow className="bg-gray-800">
            <TableHead className="text-center px-2 py-3 text-white">
              BABAK
            </TableHead>
            {matchData.referee.map((wasit, wasitIndex) => (
              <React.Fragment key={wasit._id}>
                {matchData.peserta.map((peserta, index) => (
                  <TableHead
                    key={`${wasit._id}-${peserta?._id}`}
                    className={`text-white text-center text-md py-3 ${
                      index === 0 ? "bg-yellow-600" : "bg-blue-600"
                    }`}
                  >
                    {peserta?.name}
                    <div className="text-xs mt-1">Wasit {wasitIndex + 1}</div>
                  </TableHead>
                ))}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {babak.map((babakName) => (
            <TableRow key={babakName} className="text-white hover:bg-gray-700">
              <TableCell className="px-2 py-3 text-center font-medium">
                {babakName.replace("_", " ")}
              </TableCell>
              {matchData.referee.map((wasit) => {
                const score = wasit.scores.find(
                  (s) => s.babak === babakName
                )?.score;
                return (
                  <React.Fragment key={`${babakName}-${wasit._id}`}>
                    <TableCell className="text-center px-2 py-3">
                      <span className="text-yellow-400">
                        {score?.scoreLeft || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center px-2 py-3">
                      <span className="text-blue-400">
                        {score?.scoreRight || 0}
                      </span>
                    </TableCell>
                  </React.Fragment>
                );
              })}
            </TableRow>
          ))}
          <TableRow className="text-white font-bold bg-gray-800">
            <TableCell className="px-2 py-3 text-center">Total</TableCell>
            {matchData.totalScores.map((totalScore) => (
              <React.Fragment key={`total-${totalScore.wasitId}`}>
                <TableCell className="text-center px-2 py-3">
                  <span className="text-yellow-400">
                    {totalScore.totalLeft}
                  </span>
                </TableCell>
                <TableCell className="text-center px-2 py-3">
                  <span className="text-blue-400">{totalScore.totalRight}</span>
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TableLiveScore;
