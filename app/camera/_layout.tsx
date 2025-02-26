import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";

import { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Directory, File, Paths } from "expo-file-system/next";
import { usePhotoContext } from "@/context/PhotoContext/usePhotoContext";

export default function CameraLayout() {
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const { setPhotos } = usePhotoContext();

  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>();

  if (!permission) {
    return <View />;
  }

  const takePhoto = async () => {
    console.log("Take photo");

    const p = await ref?.current?.takePictureAsync();

    console.log(p);
    if (p) {
      try {
        setPhoto(p);
        setUri(p.uri);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const savePhoto = async () => {
    console.log("Save photo");

    console.log(photo);

    if (!photo) {
      return;
    }
    const file = new File(photo.uri);

    console.log(file.uri);

    file;

    const dir = new Directory(Paths.document, "photos");
    if (!dir.exists) {
      dir.create();
    }

    file.move(dir);

    const files = dir.list();

    console.log(files);

    setPhotos(files);

    setUri(null);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera permissions are required to use this feature.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            requestPermission();
          }}
        >
          <Text style={styles.text}>Request Camera Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPicture = () => {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={styles.previewImage}
        ></Image>
        <View style={styles.previewButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setUri(null)}>
            <Ionicons name={"camera"} color="lightblue" size={60} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={savePhoto}>
            <Ionicons name={"save-outline"} color="lightblue" size={60} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.container}>
        <CameraView ref={ref} style={styles.camera} facing={facing}>
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => {
              router.back();
            }}
          >
            <FontAwesome name="close" size={50} color="lightblue" />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <Ionicons
                name={facing === "back" ? "camera-reverse" : "camera"}
                color="lightblue"
                size={50}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <FontAwesome name="circle" size={64} color="lightblue" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={selectImage}>
              <Ionicons name="images-outline" size={50} color="lightblue" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30, // TODO safe area
    flex: 1,

    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonTopContainer: {
    // flex: 1,
    flexDirection: "row",
    height: 100,
    backgroundColor: "transparent",
    margin: 12,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",

    marginBottom: 50,
  },
  permissionButton: {
    // flex: 1,
    alignSelf: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  closeCameraButton: {
    alignSelf: "flex-start",
    // backgroundColor: "grey",
    // borderRadius: 10,
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "lightblue",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
  },
  previewButtonContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    // backgroundColor: "transparent",
  },
});
