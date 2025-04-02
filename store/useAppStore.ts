import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import AsyncStorage from "expo-sqlite/kv-store";
import { Photo } from "@/models/Photo.model";

const storage: StateStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItemAsync(name);
    return value ? JSON.parse(value) : undefined;
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItemAsync(name);
  },
};

type AppState = {
  photos: Photo[];
};

export type Actions = {
  setPhotos: (photos: Photo[]) => void;
  reset: () => void;
};

const initialState: AppState = {
  photos: [],
};

const useAppStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      photos: [],
      setPhotos: (photos) => set({ photos }),
      reset: () => set(initialState),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => storage),
      // partialize: (state) => ({ photos: state.photos }),
    }
  )
);
export default useAppStore;
