import { useState } from "react";
import { PhotoContext } from "./PhotoContext";

const PhotoProvider = ({ children }: { children: React.ReactNode }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  return (
    <PhotoContext.Provider
      value={{
        photos,
        setPhotos,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export default PhotoProvider;
