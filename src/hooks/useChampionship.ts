// useChampionship.ts
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { KejuaraanSchema, KejuaraanSchemas } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Id } from "../../convex/_generated/dataModel";
type CreateFlow = "Create" | "Preview";
interface ErrorMessage {
  message: string | undefined;
}
export function useChampionship() {
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.championship.generateUploadUrl);
  const [renderedImage, setRenderedImage] = useState("");
  const [state, setState] = useState<CreateFlow>("Create");
  const createKejuaraan = useMutation(api.championship.createKejuaraan);
  const imgRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { register, handleSubmit, control, watch, reset } =
    useForm<KejuaraanSchemas>({
      resolver: zodResolver(KejuaraanSchema),
      defaultValues: {
        lokasi: "",
        name: "",
        image: "",
        tanggalDimulai: new Date(),
        tanggalSelesai: new Date(),
      },
    });

  const onNext = useCallback(() => {
    setState("Preview");
  }, []);

  const onBack = useCallback(() => {
    setState("Create");
  }, []);
  const onSubmit = async (values: KejuaraanSchemas) => {
    let storageId;
    if (selectedImage) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage.type },
        body: selectedImage,
      });
      const { storageId: uploadedStorageId } = await result.json();
      storageId = uploadedStorageId;
    }
    try {
      await createKejuaraan({
        lokasi: values.lokasi,
        name: values.name,
        image: storageId as Id<"_storage">,
        tanggalDimulai: values.tanggalDimulai.getTime(),
        tanggalSelesai: values.tanggalSelesai.getTime(),
      });
      toast({
        description: "Create Success",
      });
      setSelectedImage(null);
      setRenderedImage("");
      setState("Create");
      reset();
    } catch (erorr: any) {
      console.log(erorr);
      const errorMessage: ErrorMessage = {
        message: erorr?.message || "An unknown error occurred",
      };
      toast({
        description: errorMessage.message,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setRenderedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setRenderedImage("");
    }
  };

  return {
    register,
    handleSubmit,
    control,
    onSubmit,
    handleImageChange,
    renderedImage,
    imgRef,
    state,
    setState,
    onNext,
    onBack,
    watch,
  };
}
