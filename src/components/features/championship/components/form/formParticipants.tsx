"use client";
import React from "react";
import { useParticipants } from "@/hooks/useParticipants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FormParticipants({
  championshipname,
}: {
  championshipname: string;
}) {
  const {
    register,
    handleSubmit,
    handleUpload,
    onSubmit,
    errors,
    onNext,
    onBack,
    state,
    watch,
  } = useParticipants({ name: championshipname });

  const watchedFields = watch();

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Participant Name
        </label>
        <Input {...register("name")} placeholder="participant name" />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contingent</label>
        <Input {...register("contingent")} placeholder="contingent" />
        {errors.contingent && (
          <span className="text-red-500 text-xs">
            {errors.contingent.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Match Category</label>
        <Input {...register("matchCategory")} placeholder="match category" />
        {errors.matchCategory && (
          <span className="text-red-500 text-xs">
            {errors.matchCategory.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Documents</label>
        <Input
          type="file"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          placeholder="Upload documents"
        />
      </div>

      <Button type="button" onClick={onNext} className="w-full">
        Next
      </Button>
    </form>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <p>
        <strong>Name:</strong> {watchedFields.name}
      </p>
      <p>
        <strong>Contingent:</strong> {watchedFields.contingent}
      </p>
      <p>
        <strong>Match Category:</strong> {watchedFields.matchCategory}
      </p>
      <p>
        <strong>Documents:</strong>{" "}
        {watchedFields.document && watchedFields.document.length > 0
          ? `${watchedFields.document.length} file(s) uploaded`
          : "No files uploaded"}
      </p>
      <div className="flex justify-between w-full gap-2">
        <Button type="button" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          Submit
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md w-full mx-auto mt-8 p-6 border-2 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-6 text-center">
        {championshipname} Registration
      </h2>
      {state === "Create" ? renderForm() : renderPreview()}
    </div>
  );
}
