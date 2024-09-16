"use client";

import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { ClientOnly, DataLength } from "@/components/ui/notfound";
import { Event } from "./type";
import { getTimeClock } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ListPertandingan({ name }: { name: string }) {
  const dataPertandingan = useQuery(api.referee.getWasitAndMatches, {
    name,
  });

  if (dataPertandingan === undefined) {
    return (
      <div className="w-full h-screen justify-center items-center flex">
        <Loader2 className="animate-spin  size-10" />
      </div>
    );
  }

  if (
    (dataPertandingan && dataPertandingan?.matches.length === 0) ||
    dataPertandingan?.matches === null
  ) {
    return (
      <ClientOnly>
        <DataLength className=" h-[400px] " text="Not matchess Found" />
      </ClientOnly>
    );
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dataPertandingan?.matches.map((item, index) => {
        return <Pertandingan data={item} key={index} />;
      })}
    </div>
  );
}

function Pertandingan({ data }: { data: Event }) {
  const pathname = usePathname();
  return (
    <Link
      href={`${pathname}/${data._id}`}
      className="bg-secondary p-4 shadow-md rounded-lg mt-2 "
    >
      <span className="flex justify-between">
        <p className="text-xl font-bebas">{data.location}</p>
        <p className="text-sm text-gray-500">{getTimeClock(data.time)}</p>
      </span>
      <div className="flex justify-between w-full">
        <span>
          {data.participants[0] ? (
            <>
              <p>{data.pesertaDetails[0]?.name}</p>
              <p>{data.pesertaDetails[0]?.matchCategory}</p>
              <p>{data.pesertaDetails[0]?.contingent}</p>
            </>
          ) : (
            <p>Menunggu Pemenang</p>
          )}
        </span>
        <span className="place-content-center">VS</span>
        <span>
          {data.participants[1] ? (
            <>
              <p className="text-end">{data.pesertaDetails[1]?.name}</p>
              <p className="text-end">
                {data.pesertaDetails[1]?.matchCategory}
              </p>
              <p className="text-end">{data.pesertaDetails[1]?.contingent}</p>
            </>
          ) : (
            <p className="text-end">Menunggu Pemenang</p>
          )}
        </span>
      </div>
    </Link>
  );
}
