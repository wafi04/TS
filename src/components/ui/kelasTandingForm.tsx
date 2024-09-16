import { useState } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { FormControl, FormMessage } from "./form";
import { kelastanding } from "@/data";

export default function Kelastandings({
  field,
  error,
}: {
  field: ControllerRenderProps<
    {
      name: string;
      matchCategory: string;
      contingent: string;
    },
    "matchCategory"
  >;
  error?: FieldError;
}) {
  const [gender, setGender] = useState<"Laki-Laki" | "Perempuan" | null>(null);
  const handleGenderChange = (selectedGender: "Laki-Laki" | "Perempuan") => {
    setGender(selectedGender);
    field.onChange("");
  };
  return (
    <div className="flex flex-col space-y-5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 x">
          <label
            htmlFor="laki-laki"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Laki-Laki
          </label>
          <Checkbox
            id="laki-laki"
            checked={gender === "Laki-Laki"}
            onCheckedChange={() => handleGenderChange("Laki-Laki")}
          />
        </div>
        <div className="flex gap-2">
          <label
            htmlFor="perempuan"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Perempuan
          </label>
          <Checkbox
            id="perempuan"
            checked={gender === "Perempuan"}
            onCheckedChange={() => handleGenderChange("Perempuan")}
          />
        </div>
      </div>
      {gender && (
        <>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`${gender === "Laki-Laki" ? "A PA" : "A PI"}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {kelastanding.map((item, index) => (
                <SelectItem
                  key={index}
                  value={`${item} ${gender === "Laki-Laki" ? "PA" : "PI"}`}
                >
                  {item} {gender === "Laki-Laki" ? "PA" : "PI"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
