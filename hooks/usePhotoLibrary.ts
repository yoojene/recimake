import useAppStore from "@/store/useAppStore";
import { Directory, File, Paths } from "expo-file-system/next";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "@/models/Photo.model";
export function useImageLibrary() {
  const zPhotos = useAppStore((state) => state.photos);
  const setZPhotos = useAppStore((state) => state.setPhotos);

  const launchPicker = async () => {
    console.log("launch picker");
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const file = new File(result.assets[0].uri);

      console.log(file.uri);

      const dir = new Directory(Paths.document, "photos");
      if (!dir.exists) {
        dir.create();
      }

      file.move(dir);

      const photoFile: Photo = { file: file, date: new Date().toISOString() };

      console.log(photoFile);

      console.log(photoFile);

      setZPhotos([...zPhotos, photoFile]);
    } catch (error) {
      console.error("error picking image");
      console.error(error);
    }
  };

  return { launchPicker };
}
