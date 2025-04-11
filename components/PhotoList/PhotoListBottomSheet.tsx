import useAppStore from "@/store/useAppStore";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  useRef,
  useMemo,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
// import { Image } from "expo-image";

import AwesomeGallery, { GalleryRef } from "react-native-awesome-gallery";
import { Zoomable } from "@likashefqet/react-native-image-zoom";

// import { cssInterop } from "nativewind";
// cssInterop(Image, { className: "style" });

export default function PhotoListBottomSheet() {
  const gallery = useRef<GalleryRef>(null);

  const sheetRef = useRef<BottomSheetModal>(null);

  const setBottomSheetRef = useAppStore((state) => state.setBottomSheetRef);

  setBottomSheetRef(sheetRef);

  // sheetRef.current?.present();

  const snapPoints = useMemo(() => ["10%", "50%", "75%", "100%"], []);

  const photos = useAppStore((state) => state.photos);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    console.log("handleSheetChange", index);
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <View
        style={{ marginBottom: 200 }}
        className="w-full h-32 mb-36 bg-red-500"
      >
        {" "}
        <Button
          title="Generate Recipe"
          onPress={() => console.log("geerate button pressed")}
        />
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: { uri: string } }) => {
    return (
      <View className="flex-col justify-start p-4">
        <Image
          className="w-28 h-28 rounded-lg"
          source={{ uri: item.uri }}
        ></Image>
      </View>
    );
  }, []);

  const hide = () => {};

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      // footerComponent={renderFooter}
    >
      <BottomSheetView style={styles.contentContainer}>
        {photos && (
          <>
            <BottomSheetScrollView
              contentContainerClassName={"flex-col justify-start p-4"}
            >
              {photos
                .filter((p) => p.status === "saved")
                .map((photo) => (
                  <View className="flex-col justify-start p-4">
                    <Zoomable isDoubleTapEnabled>
                      <Image
                        key={photo.id}
                        className="w-28 h-28 rounded-lg"
                        source={{ uri: photo.file.uri }}
                      ></Image>
                    </Zoomable>
                  </View>
                ))}
              <View className="w-full h-16">
                <Button
                  title="Generate Recipe"
                  onPress={() => console.log("geerate button pressed")}
                />
              </View>
            </BottomSheetScrollView>
          </>
        )}
        {photos.length === 0 && (
          <Text className="text-black-500 font-bold text-2xl text-center">
            No photos saved yet
          </Text>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    backgroundColor: "red",
  },

  contentContainer: {
    flex: 1,
  },

  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(90, 90, 90, 0.95)",
  },
  overlayContent: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 10,
    padding: 5,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    zIndex: 100001,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
