import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { useState, useEffect } from "react";
import { kelastanding } from "@/data";

type Gender = "laki-laki" | "perempuan";

type Filter = {
  gender: Gender;
  setGender: (newGender: Gender) => void;
};

const useFilterStore = create<Filter>((set) => ({
  gender: "laki-laki",
  setGender: (newGender) => set({ gender: newGender }),
}));

export const FilterByBagan = () => {
  const { gender, setGender } = useFilterStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 900); // Adjust this value as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Add PA or PI based on gender
  const filteredBrackets = kelastanding.map((bracket) => {
    const kelasSuffix = gender === "laki-laki" ? "PA" : "PI";
    return `${bracket} ${kelasSuffix}`;
  });

  const router = useRouter();

  const DesktopDropdowns = () => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="font-bebas w-fit flex gap-3 mr-2 mx-auto border-2 p-2  rounded-md">
          Kelas Tanding
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredBrackets.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => router.push(`?kelasTanding=${item}`)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="font-bebas w-fit flex gap-3 mr-2 border-2 p-2  rounded-md">
          {gender === "laki-laki" ? "Laki-laki" : "Perempuan"}
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setGender("laki-laki")}>
            Laki-laki
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGender("perempuan")}>
            Perempuan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  const MobileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {gender === "laki-laki" ? "Laki-laki" : "Perempuan"}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setGender("laki-laki")}>
              Laki-laki
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGender("perempuan")}>
              Perempuan
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Kelas Tanding</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {filteredBrackets.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => router.push(`?kelasTanding=${item}`)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return isSmallScreen ? <MobileDropdown /> : <DesktopDropdowns />;
};
