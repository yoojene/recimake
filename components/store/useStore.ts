import { File } from "expo-file-system/next";
import { create } from "zustand";


export interface Photo {
  date: string;
  file: File
}
export type Store = {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
};
const useAppStore = create<Store>((set) => ({
  photos: [],
  setPhotos: (photos) => set({ photos }),
}));

export default useAppStore;