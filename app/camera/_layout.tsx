import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

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
          <Text style={styles.text}>Close</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <Text style={styles.text}>Flip Camera</Text>
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
    backgroundColor: "transparent",
    margin: 64,
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
