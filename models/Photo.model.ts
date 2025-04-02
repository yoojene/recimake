import { File } from "expo-file-system/next";

export interface Photo {
  id: string;
  date: string;
  status: "new" | "saved";
  file: File;
}
