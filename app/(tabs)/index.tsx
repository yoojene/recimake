import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ChefWave } from "@/components/ChefWave";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePhotoLibrary } from "@/hooks/usePhotoLibrary";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { launchPicker } = usePhotoLibrary();

  const toggleCamera = async () => {
    if (permission?.granted) {
      router.push("../camera");
      return;
    }

    const response = await requestPermission();
    if (response.granted) {
      router.push("../camera");
    }
  };

  const selectImage = async () => {
    console.log("Select image home");

    launchPicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        contentStyle={styles.parallaxContent}
        headerImage={
          <Image
            source={require("@/assets/images/food_spread.jpg")}
            style={styles.reactLogo}
          />
        }
      >
        <View style={styles.contentContainer}>
          <ThemedView style={styles.heroContainer}>
            <View style={styles.chefContainer}>
              <ChefWave />
            </View>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title" style={styles.titleText}>
                Recimake
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
              <ThemedText type="subtitle" style={styles.stepTitleText}>
                Turn ingredients into recipes in a few taps
              </ThemedText>
              <ThemedText style={styles.stepBodyText}>
                Capture ingredients live or choose existing photos to start.
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={toggleCamera}
              activeOpacity={0.85}
              style={styles.actionCard}
            >
              <View style={styles.actionIconWrap}>
                <IconSymbol size={28} name="camera.fill" color={"#0a7ea4"} />
              </View>
              <View style={styles.actionTextWrap}>
                <ThemedText style={styles.actionTitle}>Take a photo</ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  Open camera and snap your ingredients
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={selectImage}
              activeOpacity={0.85}
              style={styles.actionCard}
            >
              <View style={styles.actionIconWrap}>
                <IconSymbol
                  size={28}
                  name="photo.stack.fill"
                  color={"#0a7ea4"}
                />
              </View>
              <View style={styles.actionTextWrap}>
                <ThemedText style={styles.actionTitle}>
                  Choose from library
                </ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  Import existing ingredient photos
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
    gap: 16,
  },
  parallaxContent: {
    paddingTop: 10,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  heroContainer: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  chefContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -2,
  },
  titleText: {
    textAlign: "center",
  },
  stepContainer: {
    marginTop: 4,
    gap: 8,
    alignItems: "center",
  },
  stepTitleText: {
    marginTop: 8,
    textAlign: "center",
  },
  stepBodyText: {
    textAlign: "center",
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
  },
  actionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  actionSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#687076",
  },
  reactLogo: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
