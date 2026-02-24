import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";

import { router } from "expo-router";

import { useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { usePhotoLibrary } from "@/hooks/usePhotoLibrary";

export default function CameraLayout() {
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>();

  const { launchPicker, saveToFileSystem } = usePhotoLibrary();

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
    launchPicker();
  };

  const savePhoto = async () => {
    console.log("Save photo");

    console.log(photo);

    if (!photo) {
      return;
    }

    saveToFileSystem(photo.uri);

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
          contentFit="cover"
          style={styles.previewImage}
        ></Image>
        <View
          style={[styles.previewButtonContainer, { bottom: Math.max(16, insets.bottom + 8) }]}
        >
          <TouchableOpacity
            style={[styles.bottomActionButton, styles.previewActionButton]}
            activeOpacity={0.8}
            onPress={() => setUri(null)}
          >
            <Ionicons name={"camera"} color="lightblue" size={36} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomActionButton, styles.previewActionButton]}
            activeOpacity={0.8}
            onPress={savePhoto}
          >
            <Ionicons name={"save-outline"} color="lightblue" size={36} />
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
            style={[styles.closeCameraButton, { top: Math.max(14, insets.top + 4) }]}
            activeOpacity={0.8}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="close" size={34} color="lightblue" />
          </TouchableOpacity>
          <View style={[styles.buttonContainer, { bottom: Math.max(16, insets.bottom + 8) }]}>
            <TouchableOpacity
              style={styles.bottomActionButton}
              activeOpacity={0.8}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <Ionicons
                name={facing === "back" ? "camera-reverse" : "camera"}
                color="lightblue"
                size={34}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomActionButton, styles.captureButton]}
              activeOpacity={0.8}
              onPress={takePhoto}
            >
              <FontAwesome name="circle" size={64} color="lightblue" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomActionButton}
              activeOpacity={0.8}
              onPress={selectImage}
            >
              <Ionicons name="images-outline" size={34} color="lightblue" />
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
    flex: 1,
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
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
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
    position: "absolute",
    top: 14,
    left: 14,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    zIndex: 10,
  },
  bottomActionButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  captureButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginTop: -6,
    borderWidth: 0,
  },
  previewActionButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "lightblue",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  previewButtonContainer: {
    position: "absolute",
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
