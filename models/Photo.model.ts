import { File } from "expo-file-system/next";

export interface Photo {
  date: string;
  file: File;
}
