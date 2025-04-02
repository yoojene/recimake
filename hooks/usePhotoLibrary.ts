import useAppStore from "@/store/useAppStore";
import { Directory, File, Paths } from "expo-file-system/next";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "@/models/Photo.model";
import uuid from "react-native-uuid";

export function usePhotoLibrary() {
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

      saveToFileSystem(result.assets[0].uri);

     
    } catch (error) {
      console.error("error picking image");
      console.error(error);
    }
  };

  const saveToFileSystem = async (uri: string, path: string = "photos") => {
    console.log("save to file system");
    const file = new File(uri);

    const dir = new Directory(Paths.document, path);
    if (!dir.exists) {
      dir.create();
    }
    file.move(dir);
    const photoFile: Photo = {
      file: file,
      date: new Date().toISOString(),
      status: "new",
      id: uuid.v4(),
    };

    setZPhotos([...zPhotos, photoFile]);
  };

  const listFiles = async (path: string = "photos") => {

    const dir = new Directory(Paths.document, path);
    if (!dir.exists) {
      return [];
    }

    const files = dir.list();
    console.log("files in directory " + path);
    console.log(files);

    
    return files;

  }

  const deleteDirectory = async (path: string) => {
    const dir = new Directory(Paths.document, path);
    if (dir.exists) {
      dir.delete();
    }
  };

  const deleteFile = async (uri: string, path: string = "photos") => {

    const dir = new Directory(Paths.document, path);
    if (!dir.exists) {
      return;
      
    }

    const files = dir.list();

    const file = files.find((f) => f.uri === uri);

    if (file) {
      file.delete();
    }
    const newPhotos = zPhotos.filter((p) => p.file.uri !== uri);
    setZPhotos(newPhotos);

  }

  return {
    launchPicker,
    saveToFileSystem,
    listFiles,
    deleteDirectory,
    deleteFile,
  };
}
