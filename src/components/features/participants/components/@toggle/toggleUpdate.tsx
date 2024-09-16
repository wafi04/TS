import React, { useCallback, useState } from "react";
import { Ellipsis, FileText, ImageIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Trash2 } from "lucide-react";
import { Peserta } from "../types";
import { partcipantsSchema, PartcipantsSchema } from "@/schemas/schema";
import Kelastandings from "@/components/ui/kelasTandingForm";

interface PropsDilaog {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  peserta: Peserta;
}

const ToggleUpdate = ({ peserta }: { peserta: Peserta }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [info, setInfo] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group-hover:bg-primary rounded-full size-8 p-2 bg-transparent text-gray-500 flex items-center">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="items-center justify-center flex flex-col w-full">
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="hover:bg-secondary w-full justify-center"
          >
            Update
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="hover:bg-secondary w-full justify-center"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="hover:bg-secondary w-full justify-center"
            onClick={() => setInfo(true)}
          >
            Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <DialogUpdatePeserta
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          peserta={peserta}
        />
      )}
      {openDelete && (
        <DialogDeletePeserta
          onClose={() => setOpenDelete(false)}
          onOpen={() => setOpenDelete(true)}
          open={openDelete}
          peserta={peserta}
        />
      )}
      {info && (
        <DialogPeserta
          onClose={() => setInfo(false)}
          onOpen={() => setInfo(true)}
          open={info}
          peserta={peserta}
        />
      )}
    </>
  );
};

export default ToggleUpdate;

export function DialogUpdatePeserta({
  open,
  onOpen,
  onClose,
  peserta,
}: PropsDilaog) {
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Participant Details</DialogTitle>
            <DialogDescription>
              Modify the details or status of the participant for the selected
              match. Ensure that all changes are accurate before saving.
            </DialogDescription>
          </DialogHeader>
          <FormPeserta peserta={peserta} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormPeserta({
  peserta,
  onClose,
}: {
  peserta: Peserta;
  onClose: () => void;
}) {
  const form = useForm<PartcipantsSchema>({
    resolver: zodResolver(partcipantsSchema),
    defaultValues: {
      matchCategory: peserta.matchCategory,
      name: peserta.name,
      contingent: peserta.contingent,
    },
  });
  const { toast } = useToast();
  const updatePesertas = useMutation(api.participants.updatePeserta);
  async function onSubmit(values: PartcipantsSchema) {
    try {
      const { matchCategory, contingent, name } = values;
      await updatePesertas({
        matchCategory,
        contingent,
        name,
        peserta: peserta._id,
      });
      toast({
        description: "Succces",
      });
      onClose();
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Peserta</FormLabel>
              <FormControl>
                <Input placeholder="Joko Samudra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contingent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kotingen</FormLabel>
              <FormControl>
                <Input placeholder="Lamongan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="matchCategory"
          render={({ field }) => <Kelastandings field={field} />}
        />
        <Button className="w-full " type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function DialogDeletePeserta({
  open,
  onOpen,
  onClose,
  peserta,
}: PropsDilaog) {
  const { toast } = useToast();
  const deletePeserta = useMutation(api.participants.deletePeserta);
  const handleDelete = async () => {
    try {
      await deletePeserta({
        peserta: peserta._id,
      });
      toast({
        description: "Succes ",
      });
      onClose();
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            Konfirmasi Penghapusan
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus peserta ini? Tindakan ini tidak
            dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Peserta: <span className="font-medium">{peserta.name}</span>
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function ImageModal({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  if (!url) return null;

  return (
    <Dialog open={!!url} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-md flex justify-between items-center">
            Image Preview
            <DialogClose className="rounded-full bg-secondary p-1">
              <X />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <img
            src={url}
            alt="Document Preview"
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DialogPeserta({ peserta, onClose, open }: PropsDilaog) {
  const [showMedia, setShowMedia] = useState(false);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const data = useQuery(api.media.getMedia, {
    participantId: peserta._id,
  });
  const mutation = useMutation(api.participants.updateAggre);

  const handleViewMedia = () => {
    setShowMedia(true);
  };

  const handleUpdate = useCallback(async () => {
    try {
      await mutation({
        peserta: peserta._id,
      });
    } catch (error) {
      toast({
        description: "Something Went Wrong",
      });
    }
  }, []);

  const handleDocumentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, url: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (isImageUrl(url)) {
        setSelectedImage(url);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  const isImageUrl = (url: string): boolean => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-md flex justify-between items-center">
              Participants Detail
              <DialogClose
                onClick={onClose}
                className="rounded-full bg-secondary p-1"
              >
                <X />
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <h4 className="border-2 p-2 rounded-md">
              Name: <span>{peserta.name}</span>
            </h4>
            <h4 className="border-2 p-2 rounded-md">
              Kontingen: <span>{peserta.contingent}</span>
            </h4>
            <h4 className="border-2 p-2 rounded-md">
              Kelas Tanding: <span>{peserta.matchCategory}</span>
            </h4>
            <Button onClick={handleViewMedia} className="w-full">
              <FileText className="mr-2 h-4 w-4" /> View Media Documents
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>

          {showMedia && (
            <div className="mt-4 border-t pt-4">
              <h5 className="font-semibold mb-2">Media Documents</h5>
              {data && data.length > 0 ? (
                <ul className="space-y-2">
                  {data.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <div
                        onClick={(e) => handleDocumentClick(e, doc.url)}
                        className="flex items-center cursor-pointer text-blue-500 hover:underline"
                      >
                        {isImageUrl(doc.url) ? (
                          <ImageIcon className="mr-2 h-4 w-4" />
                        ) : (
                          <FileText className="mr-2 h-4 w-4" />
                        )}
                        <span>{`Document ${index + 1}`}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No media documents available.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <ImageModal url={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
