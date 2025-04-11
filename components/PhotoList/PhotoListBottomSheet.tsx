import useAppStore from "@/store/useAppStore";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function PhotoListBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const photos = useAppStore((state) => state.photos);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    console.log("handleSheetChange", index);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <BottomSheetView style={styles.contentContainer}>
          {photos ? (
            <>
              {photos
                .filter((p) => p.status === "saved")
                .map((photo) => (
                  // <Text key={photo.id}>{photo.file.uri}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      padding: 8,
                    }}
                    key={photo.id}
                  >
                    <Image
                      source={{ uri: photo.file.uri }}
                      style={{ width: 100, height: 100, borderRadius: 25 }}
                    ></Image>
                    {/* <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        marginLeft: 8,
                      }}
                    ></View> */}
                  </View>
                ))}
            </>
          ) : (
            <Text>No photos saved</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});
