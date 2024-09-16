"use client";

import { ChevronDown } from "lucide-react";

import { useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { api } from "../../../../convex/_generated/api";

export const FilterPertandingan = ({ name }: { name: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pertandingan = useQuery(api.match.getPertandingan, {
    championshipname: name,
  });

  const handlePertandinganSelect = useCallback(
    (pertandinganId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (pertandinganId) {
        params.set("pertandingan", pertandinganId);
      } else {
        params.delete("pertandingan");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const selectedPertandingan = searchParams.get("pertandingan");
  const selectedIndex = pertandingan?.findIndex(
    (item) => item._id === selectedPertandingan
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-2 p-2 mr-2 rounded-md flex items-center gap-3 hover:bg-card">
        {selectedPertandingan &&
        selectedIndex !== undefined &&
        selectedIndex !== -1
          ? `Partai ${selectedIndex + 1}`
          : "Match"}
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {pertandingan?.map((item, index) => (
          <DropdownMenuItem
            key={item._id}
            onSelect={() => handlePertandinganSelect(item._id)}
          >
            Partai {index + 1}
            {item._id === selectedPertandingan && " (Selected)"}
          </DropdownMenuItem>
        )) ?? (
          <DropdownMenuItem disabled>No matches available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
