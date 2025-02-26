import { createContext, Dispatch, SetStateAction } from "react";

type PhotoContextType = {
  setPhotos: Dispatch<SetStateAction<any>>;
  photos: any[];
};
export const PhotoContext = createContext<PhotoContextType>(null!);
