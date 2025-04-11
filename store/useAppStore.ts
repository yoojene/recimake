import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import AsyncStorage from "expo-sqlite/kv-store";
import { Photo } from "@/models/Photo.model";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
  bottomSheetRef: React.RefObject<BottomSheetModal> | null;
};

export type Actions = {
  setPhotos: (photos: Photo[]) => void;
  reset: () => void;
  setPhotoStatus: (status: "new" | "saved", id: string) => void;
  setBottomSheetRef: (ref: React.RefObject<BottomSheetModal>) => void;
  
};

const initialState: AppState = {
  photos: [],
  bottomSheetRef: null,
};

const useAppStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      photos: [],
      setPhotos: (photos) => set({ photos }),
      setPhotoStatus: (status: "new" | "saved", id: string) => {
        const photos = get().photos;
        const index = photos.findIndex((photo) => photo.id === id);
        if (index !== -1) {
          const updatedPhotos = [...photos];
          updatedPhotos[index].status = status;
          set({ photos: updatedPhotos });
        }
      },
      bottomSheetRef: null,
      setBottomSheetRef: (bottomSheetRef) => set({ bottomSheetRef }),
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
