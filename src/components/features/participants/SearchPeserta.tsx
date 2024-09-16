import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { create } from "zustand";

type Search = {
  search: string;
  setSearch: (search: string) => void;
};

export const useSearch = create<Search>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));

export function SearchPeserta() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { search, setSearch } = useSearch();
  const handlesearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value!.trim();
    setSearch(searchTerm);
  };
  return (
    <div
      className="relative "
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={`flex items-center transition-all duration-300 ${isExpanded ? "w-64" : "w-20"} overflow-hidden`}
      >
        <Input
          value={search}
          onChange={handlesearch}
          placeholder="Search"
          className={`py-2 bg-accent focus:outline-none transition-all duration-300 ${isExpanded ? "w-full opacity-100" : "w-0 opacity-0"}`}
        />
        <button
          type="submit"
          className={`flex items-center justify-center size-8 bg-accent rounded-full ${isExpanded && "absolute right-0"}`}
        >
          <SearchIcon className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
