import useAppStore from "@/store/useAppStore";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useImage } from "../ImageView/ImageView";
import { Photo } from "@/models/Photo.model";

export default function PhotoListBottomSheet() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const setBottomSheetRef = useAppStore((state) => state.setBottomSheetRef);
  const setSheetOpen = useAppStore((state) => state.setSheetOpen);

  useEffect(() => {
    setBottomSheetRef(sheetRef);
  }, []);

  const snapPoints = useMemo(() => ["90%"], []);

  // Store
  const photos = useAppStore((state) => state.photos);

  const { showImage } = useImage();

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      setSheetOpen(false);
    }
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <View className="w-full h-16">
        <Button
          title="Generate Recipe"
          onPress={() => console.log("geerate button pressed")}
        />
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: Photo }) => {
    const photo: Photo = item;
    return (
      <TouchableOpacity
        className="border-b-4 border-gray-100 bg-sky-50 items-center p-4"
        key={photo.id}
        onPress={() => showImage(photo.file.uri)}
      >
        <Image
          source={{ uri: photo.file.uri }}
          className="w-36 h-36 rounded-lg"
        />
      </TouchableOpacity>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableOverDrag={false}
      onChange={handleSheetChange}
      footerComponent={renderFooter}
    >
      <BottomSheetView style={styles.contentContainer}>
        {photos && (
          <>
            <BottomSheetFlashList
              contentContainerClassName={"flex-col justify-start p-4"}
              data={photos as any}
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              estimatedItemSize={98}
            ></BottomSheetFlashList>
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
    paddingTop: 200,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
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
