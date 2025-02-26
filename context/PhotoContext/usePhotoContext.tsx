import { useContext } from "react";
import { PhotoContext } from "./PhotoContext";

export const usePhotoContext = () => {
  const photoContext = useContext(PhotoContext);
  if (photoContext === undefined) {
    throw new Error("usePhotoContext must be inside a PhotoProvider");
  }
  return photoContext;
};
