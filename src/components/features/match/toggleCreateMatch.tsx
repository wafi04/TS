"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { PertandinganSchema, PertandinganValues } from "@/schemas/schema";
import { usePeserta } from "@/hooks/usePerserta";
import { CreateButtons } from "../referee/toggleCreateKeyboard";
import { ListWasitProps, Referee } from "../referee/ListReferee";

enum STEPS {
  CREATE_PERTANDINGAN = 1,
  ADD_WASIT = 2,
}

export default function OtherPesertaButtons({
  msg,
  name,
  onChange,
}: ListWasitProps) {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReferee, setIsReferee] = useState<boolean>(false);
  const selectPeserta = usePeserta();

  return (
    <div className="flex items-center w-fit gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="border-2 mr-3 p-1 rounded-full bg-card hover:bg-accent">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            Create Match
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Create Keyboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsReferee(true)}>
            Create Referee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isDialogOpen && (
        <CreateDialog
          open={isDialogOpen}
          namaKejuaraan={name}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {isOpen && (
        <CreateButtons
          name={name}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      {isReferee && (
        <Referee
          name={name}
          open={isReferee}
          msg={msg}
          onChange={onChange}
          onClose={() => setIsReferee(false)}
        />
      )}
    </div>
  );
}

function CreateDialog({
  open,
  namaKejuaraan,
  onClose,
}: {
  open: boolean;
  namaKejuaraan: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Now</DialogTitle>
          <DialogDescription>
            Don&apos;t miss out on the opportunity to participate! Click the
            button below to register.
          </DialogDescription>
        </DialogHeader>
        <CreateMatchForm namaKejuaraan={namaKejuaraan} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function CreateMatchForm({
  namaKejuaraan,
  onClose,
}: {
  namaKejuaraan: string;
  onClose: () => void;
}) {
  const [selectedWasit, setSelectedWasit] = useState<string[]>([]);
  const [step, setStep] = useState(STEPS.CREATE_PERTANDINGAN);
  const { toast } = useToast();
  const { selectedParticipants, deselectAll } = usePeserta();
  const createMatch = useMutation(api.match.createBracket);
  const form = useForm<PertandinganValues>({
    resolver: zodResolver(PertandinganSchema),
    defaultValues: {
      location: "",
      time: new Date(),
      refereeIds: selectedWasit,
    },
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const onSubmit = async (values: PertandinganValues) => {
    try {
      const timestamp = values.time.getTime();
      const data = await createMatch({
        championshipName: namaKejuaraan,
        location: values.location,
        time: timestamp,
        refereeIds: selectedWasit as Id<"referee">[],
      });
      deselectAll();
      toast({ description: "Match created successfully!" });
      onClose();
    } catch (error) {
      toast({ description: "Something went wrong. Please try again." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {step === STEPS.CREATE_PERTANDINGAN ? (
          <>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Lamongan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <SelectWasit
            namaKejuaraan={namaKejuaraan}
            selectedWasit={selectedWasit}
            setSelectedWasit={setSelectedWasit}
          />
        )}

        <div className="flex gap-2 mt-4">
          {step !== STEPS.CREATE_PERTANDINGAN && (
            <Button onClick={handleBack} className="w-full bg-card">
              Previous
            </Button>
          )}
          <Button
            type={step === STEPS.ADD_WASIT ? "button" : "submit"}
            onClick={handleNext}
            className="w-full bg-card"
          >
            {step === STEPS.ADD_WASIT ? "Next" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SelectWasit({
  namaKejuaraan,
  selectedWasit,
  setSelectedWasit,
}: {
  namaKejuaraan: string;
  selectedWasit: string[];
  setSelectedWasit: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const data = useQuery(api.referee.getWasitForChampionship, {
    kejuaraanName: namaKejuaraan,
  });

  const handleWasitSelection = (wasitId: string) => {
    setSelectedWasit((prev) =>
      prev.includes(wasitId)
        ? prev.filter((id) => id !== wasitId)
        : [...prev, wasitId]
    );
  };

  return (
    <div>
      <h3>Select Wasit</h3>
      {data?.map((wasit) => (
        <div
          key={wasit._id}
          className="bg-card p-2 rounded-md flex justify-between items-center gap-4 relative"
        >
          <div className="flex items-center space-x-3">
            <Image
              src={wasit.userDetails?.image || "/default-avatar.png"}
              alt="Wasit Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p>{wasit.userDetails?.name}</p>
              <p className="text-gray-700">{wasit.userDetails?.email}</p>
            </div>
          </div>
          <Input
            type="checkbox"
            id={wasit._id}
            className="size-5 rounded-full"
            checked={selectedWasit.includes(wasit._id)}
            onChange={() => handleWasitSelection(wasit._id)}
          />
        </div>
      ))}
    </div>
  );
}
