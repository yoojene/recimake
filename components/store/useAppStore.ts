import { File } from "expo-file-system/next";
import { create } from "zustand";


export interface Photo {
  date: string;
  file: File
}
export type AppStore = {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
};
const useAppStore = create<AppStore>((set) => ({
  photos: [],
  setPhotos: (photos) => set({ photos }),
}));

export default useAppStore;