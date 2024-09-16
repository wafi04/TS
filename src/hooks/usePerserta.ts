import { create } from "zustand";
type SelectPesertaByKelasTanding = {
  gender: { [key: string]: boolean };
  setGender: (newGender: { [key: string]: boolean }) => void;
  selectedParticipants: string[];
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  showCheckboxes: boolean;
  toggleCheckboxes: () => void;
  toggleParticipant: (id: string) => void;
};

export const usePeserta = create<SelectPesertaByKelasTanding>((set) => ({
  gender: {
    "LAKI-LAKI": false,
    PEREMPUAN: false,
  },
  setGender: (newGender) => set({ gender: newGender }),
  selectedParticipants: [],
  selectAll: (ids) => set({ selectedParticipants: ids }),
  deselectAll: () => set({ selectedParticipants: [] }),
  toggleParticipant: (id) =>
    set((state) => {
      const isSelected = state.selectedParticipants.includes(id);
      return {
        selectedParticipants: isSelected
          ? state.selectedParticipants.filter(
              (participantId) => participantId !== id
            )
          : [...state.selectedParticipants, id],
      };
    }),
  showCheckboxes: false,
  toggleCheckboxes: () =>
    set((state) => ({ showCheckboxes: !state.showCheckboxes })),
}));
