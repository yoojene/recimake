import useAppStore from "@/store/useAppStore";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { cssInterop } from "nativewind";
// cssInterop(Image, { className: "style" });

export default function PhotoListBottomSheet() {
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
                    <Image
                      key={photo.id}
                      className="w-28 h-28 rounded-lg"
                      source={{ uri: photo.file.uri }}
                    ></Image>
                  </View>
                ))}
            </BottomSheetScrollView>
            <View className="w-full h-16">
              <Button
                title="Generate Recipe"
                onPress={() => console.log("geerate button pressed")}
              />
            </View>
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
});
