"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "../../../../convex/_generated/api";
import OtherPesertaButtons from "../match/toggleCreateMatch";

export interface ListWasitProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  msg: string;
  name: string;
}

interface Referee extends ListWasitProps {
  onClose: () => void;
  open: boolean;
}

export function Referee({ msg, name, onChange, onClose, open }: Referee) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogTrigger className="px-4 py-2 border-2 rounded-md hover:bg-card dark:border-gray-700 border-gray-400">
        Create Wasit
      </DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>Add Wasit to lead Match</DialogTitle>
          <DialogDescription>
            Please select a referee from the list below to lead the upcoming
            match.
          </DialogDescription>
        </DialogHeader>
        <SearchWasit onChange={onChange} />
        <ListUsers name={name} msg={msg} />
      </DialogContent>
    </Dialog>
  );
}

function SearchWasit({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <div className="relative w-full">
        <Input type="text" placeholder="Search Wasit...." onChange={onChange} />
        <Search className="absolute right-3 top-2" />
      </div>
    </>
  );
}

function ListUsers({ name, msg }: { name: string; msg: string }) {
  const { toast } = useToast();
  const data = useQuery(api.users.SearchUser, {
    name: msg,
  });
  const add = useMutation(api.referee.createWasitForChampionship);
  const handleClick = useCallback(async (id: string) => {
    try {
      const data = await add({
        name,
        wasitId: id,
      });
      toast({
        description: data,
      });
    } catch (error) {
      toast({
        description: "Cannot Create Wasit",
      });
    }
  }, []);
  return (
    <>
      {data?.map((item) => (
        <div
          key={item._id}
          className="bg-card  p-2  rounded-md justify-between flex gap-4"
        >
          <div className="flex space-x-3">
            <Image
              src={item.image as string}
              alt="/"
              width={500}
              height={500}
              className="size-10  rounded-full place-content-center"
            />
            <span className="text-sm">
              <p>{item.name}</p>
              <p className="text-gray-700">{item.email}</p>
            </span>
          </div>
          <Button variant={"ghost"} onClick={() => handleClick(item._id)}>
            Add
          </Button>
        </div>
      ))}
    </>
  );
}
