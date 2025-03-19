import { File } from "expo-file-system/next";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import AsyncStorage from "expo-sqlite/kv-store";

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

export interface Photo {
  date: string;
  file: File;
}
export type AppStore = {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
};

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      photos: [],
      setPhotos: (photos) => set({ photos }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => storage),
      // partialize: (state) => ({ photos: state.photos }),
    }
  )
);
export default useAppStore;
