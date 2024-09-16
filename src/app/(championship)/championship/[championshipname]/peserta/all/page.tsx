"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { redirect, usePathname, useRouter } from "next/navigation";
import {
  SearchPeserta,
  useSearch,
} from "@/components/features/participants/SearchPeserta";
import { api } from "../../../../../../../convex/_generated/api";
import Header from "@/components/features/championship/components/Header";
import { Iparams } from "../../page";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import ToggleUpdate from "@/components/features/participants/components/@toggle/toggleUpdate";

const Participants = ({ params }: Iparams) => {
  const { user, loading } = useUser();
  const championshipname = decodeURIComponent(params.championshipname);
  const { search } = useSearch();
  const kejuaaranById = useQuery(api.championship.getKejuaraanByName, {
    name: championshipname,
  });

  if (kejuaaranById?.user !== user?._id) {
    return redirect("/home");
  }
  const data = useQuery(api.participants.getPeserta, {
    kejuaraanName: decodeURIComponent(championshipname),
    search,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]  w-full">
        <Loader2 className="animate-spin  text-blue-500 size-10" />
      </div>
    );
  }
  return (
    <main className="  h-screen  w-full   container ">
      <Header title="Participants" backs={true}>
        <div className="flex gap-4">
          <SearchPeserta />
        </div>
      </Header>
      <Table className="mt-2 ">
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
                  className="px-2 group text-sm border-b-neutral-800 text-white hover:bg-neutral-800"
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
                  {kejuaaranById && kejuaaranById.user === user?._id && (
                    <TableCell className="flex justify-center items-center border-gray-800">
                      <ToggleUpdate peserta={item} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Participants;
