import { create } from "zustand";

// Menggunakan literal types daripada enum
type BabakType = {
  babak: "First Round" | "Second Round" | "Third Round";
  setBabak: (babak: "First Round" | "Second Round" | "Third Round") => void;
};

export const ChangeBabak = create<BabakType>((set) => ({
  babak: "First Round", // Nilai default
  setBabak: (babak) => set({ babak }),
}));
