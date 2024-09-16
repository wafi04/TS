import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useChampionship } from "@/hooks/useChampionship";

export function DialogChampionship() {
  const {
    register,
    handleSubmit,
    control,
    onSubmit,
    handleImageChange,
    renderedImage,
    imgRef,
    state,
    onNext,
    onBack,
    watch,
  } = useChampionship();

  const watchedFields = watch();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-4 bg-transparent border-2 dark:text-white text-black hover:text-white dark:hover:text-black">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6">
        {state === "Create" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Championship Name</Label>
              <Input id="name" {...register("name")} placeholder="PON 2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lokasi">Location</Label>
              <Input
                id="lokasi"
                {...register("lokasi")}
                placeholder="Jakarta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalDimulai">Start Date</Label>
              <Controller
                name="tanggalDimulai"
                control={control}
                render={({ field }) => (
                  <Input
                    id="tanggalDimulai"
                    type="date"
                    {...field}
                    value={field.value.toISOString().split("T")[0]}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalSelesai">End Date</Label>
              <Controller
                name="tanggalSelesai"
                control={control}
                render={({ field }) => (
                  <Input
                    id="tanggalSelesai"
                    type="date"
                    {...field}
                    value={field.value.toISOString().split("T")[0]}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                ref={imgRef}
              />
            </div>
            <Button type="button" onClick={onNext} className="w-full">
              Next
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between w-full">
              <h2 className="text-lg font-semibold">Preview</h2>
              <Button onClick={handleSubmit(onSubmit)} className="rounded-full">
                Submit
              </Button>
            </div>
            <p>
              <strong>Name:</strong> {watchedFields.name}
            </p>
            <p>
              <strong>Location:</strong> {watchedFields.lokasi}
            </p>
            <p>
              <strong>Start Date:</strong>
              {watchedFields.tanggalDimulai.toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {watchedFields.tanggalSelesai.toLocaleDateString()}
            </p>
            {renderedImage && (
              <img
                src={renderedImage}
                alt="Preview"
                className="mt-2 max-w-full h-[100px]"
              />
            )}
            <Button onClick={onBack} className="w-full">
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
