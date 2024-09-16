import { string, z } from "zod";
import { Id } from "../../convex/_generated/dataModel";

const stringSchema = z.string().min(1, "Required");

export const KejuaraanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lokasi: z.string().min(1, "Lokasi is required"),
  image: z.string().optional(), // Assuming the image is a string representing the ID
  tanggalDimulai: z.date({ required_error: "Tanggal Dimulai is required" }),
  tanggalSelesai: z.date({ required_error: "Tanggal Selesei is required" }),
});

export type KejuaraanSchemas = z.infer<typeof KejuaraanSchema>;

export const partcipantsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  matchCategory: stringSchema,
  contingent: stringSchema,
  document: z.array(z.string()).optional(),
});

export type PartcipantsSchema = z.infer<typeof partcipantsSchema>;
export const PertandinganSchema = z.object({
  location: z.string().min(1, "Lokasi Is Required"),
  time: z.date({ required_error: "waktu is required" }),
  refereeIds: z.array(z.string()),
});

export type PertandinganValues = z.infer<typeof PertandinganSchema>;
export const ButtonFormSchema = z.object({
  name: z.string(),
  value: z.string().transform((val) => Number(val)),
});
export type ButtonFormValues = z.infer<typeof ButtonFormSchema>;
