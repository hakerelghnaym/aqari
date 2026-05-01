import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavState {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
}

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      ids: [],
      isFavorite: (id) => get().ids.includes(id),
      toggle: (id) => set((s) => ({
        ids: s.ids.includes(id) ? s.ids.filter(x => x !== id) : [...s.ids, id]
      })),
    }),
    { name: "aqari-favorites" }
  )
);
