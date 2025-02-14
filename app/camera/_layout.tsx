import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function CameraLayout() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraOn, setCameraOn] = useState<boolean>(true);

  if (!permission) {
    return <View />;
  }

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

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert("Take a picture")}
          >
            <FontAwesome name="circle" size={64} color="lightblue" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert("Go to photo library")}
          >
            <Ionicons name="images-outline" size={50} color="lightblue" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50, // TODO safe area
    flex: 1,
    // flex: 1,
    // flexDirection: "column",
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
});
