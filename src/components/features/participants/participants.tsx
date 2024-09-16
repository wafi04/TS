"use client";
import React from "react";
import Header from "../championship/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchPeserta, useSearch } from "./SearchPeserta";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const Participants = ({ championshipname }: { championshipname: string }) => {
  const { search } = useSearch();
  const data = useQuery(api.participants.getPesertaNotaGree, {
    kejuaraanName: decodeURIComponent(championshipname),
    search,
  });

  const { push } = useRouter();
  const pathname = usePathname();
  return (
    <>
      <Header title="Participants">
        <div className="flex gap-4">
          <SearchPeserta />
          <Button
            onClick={() => push(`${pathname}/all`)}
            className="font-bebas bg-transparent border-2 dark:text-white dark:hover:bg-neutral-700"
          >
            See ALL
          </Button>
        </div>
      </Header>
      <Table className="mt-2">
        {data && data.length > 0 && (
          <TableHeader>
            <TableRow className="items-center px-2">
              <TableHead className="w-[100px] text-center border-2 border-gray-800">
                ID
              </TableHead>
              <TableHead className="text-center border-2 border-gray-800">
                NAMA
              </TableHead>
              <TableHead className="text-center border-2 border-gray-800">
                KELAS TANDING
              </TableHead>
              <TableHead className="text-center border-2 border-gray-800">
                KONTINGEN
              </TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {data === undefined
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-2 text-center border-2 border-gray-800">
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell className="text-center border-2 border-gray-800 py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-center border-2 border-gray-800">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-center border-2 border-gray-800">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
            : data.map((item, index) => (
                <TableRow
                  key={index}
                  className="px-2 text-sm border-b-neutral-800 text-white hover:bg-neutral-800"
                >
                  <TableCell className="px-2 text-center border-2 border-gray-800">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center border-2 border-gray-800 py-4">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center border-2 border-gray-800">
                    {item.matchCategory}
                  </TableCell>
                  <TableCell className="text-center border-2 border-gray-800">
                    {item.contingent}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Participants;
