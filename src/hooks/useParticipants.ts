import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { partcipantsSchema, PartcipantsSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "../../convex/_generated/dataModel";

type CreateFlow = "Create" | "Preview";

export function useParticipants({ name }: { name: string }) {
  const mutation = useMutation(api.participants.createPeserta);
  const generateUploadUrl = useMutation(api.championship.generateUploadUrl);
  const [state, setState] = useState<CreateFlow>("Create");
  const { toast } = useToast();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PartcipantsSchema>({
    resolver: zodResolver(partcipantsSchema),
    defaultValues: {
      contingent: "",
      matchCategory: "",
      name: "",
      document: [],
    },
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;

    const uploadedDocuments: Id<"_storage">[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const { storageId } = await response.json();

        if (typeof storageId === "string" && storageId.length > 0) {
          uploadedDocuments.push(storageId as Id<"_storage">);
        } else {
          console.error("Invalid storage ID received:", storageId);
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload document.",
        });
      }
    }
    console.log("Uploaded documents:", uploadedDocuments);
    setValue("document", uploadedDocuments);
    toast({
      title: "Upload Success",
      description: `${uploadedDocuments.length} document(s) uploaded successfully.`,
    });
  };

  const onSubmit = async (data: PartcipantsSchema) => {
    try {
      console.log("Submitting data:", {
        championshipname: name,
        matchCategory: data.matchCategory,
        contingent: data.contingent,
        name: data.name,
        document: data.document,
      });
      const result = await mutation({
        championshipname: name,
        matchCategory: data.matchCategory,
        contingent: data.contingent,
        name: data.name,
        document: data.document as Id<"_storage">[],
      });
      console.log("Mutation result:", result);
      toast({
        title: "Success",
        description: "Participant created successfully.",
      });
      reset();
      setState("Create");
    } catch (error) {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to create participant.",
      });
    }
  };

  const onNext = () => {
    setState("Preview");
  };

  const onBack = () => {
    setState("Create");
  };

  return {
    register,
    handleSubmit,
    handleUpload,
    onSubmit,
    onNext,
    onBack,
    watch,
    state,
    errors,
  };
}
