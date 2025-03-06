import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { Directory, Paths, File } from "expo-file-system/next";
import { usePhotoContext } from "@/context/PhotoContext/usePhotoContext";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as ImagePicker from "expo-image-picker";
import { ChefWave } from "@/components/ChefWave";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { photos, setPhotos } = usePhotoContext();

  const toggleCamera = async () => {
    if (!permission) {
      return;
    }

    requestPermission();

    if (permission.granted) {
      router.push("../camera");
    }
  };

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("result");
      console.log(result);

      if (result.assets) {
        const file = new File(result.assets[0].uri);

        const dir = new Directory(Paths.document, "photos");
        if (!dir.exists) {
          dir.create();
        }

        file.move(dir);

        const files = dir.list();

        console.log(files);

        setPhotos(files);
      }
    } catch (error) {
      console.log("error picking image");
      console.log(error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/food_spread.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Recimake</ThemedText>
        <ChefWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Your one stop app to find new exciting recipes from your ingredients
        </ThemedText>
        <ThemedText>
          Take or upload photos from your camera roll to get started
        </ThemedText>
      </ThemedView>

      <TouchableOpacity
        onPress={toggleCamera}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconSymbol size={54} name="camera.fill" color={"#000"} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={selectImage}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconSymbol size={54} name="photo.stack.fill" color={"#000"} />
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
