import useAppStore from "@/store/useAppStore";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useImage } from "../ImageView/ImageView";
import { Photo } from "@/models/Photo.model";
import Button from "../ui/Button/Button";
import { useRecipe } from "@/hooks/useRecipe";

export default function PhotoListBottomSheet() {
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    setBottomSheetRef(sheetRef);
  }, []);

  const snapPoints = useMemo(() => ["90%"], []);

  // Store
  const photos = useAppStore((state) => state.photos);
  const savedPhotos = useMemo(
    () =>
      [...photos]
        .filter((photo) => photo.status === "saved")
        .sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any)),
    [photos]
  );

  const setBottomSheetRef = useAppStore((state) => state.setBottomSheetRef);
  const setSheetOpen = useAppStore((state) => state.setSheetOpen);

  const { showImage } = useImage();

  const { generateRecipe } = useRecipe();
  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    console.log("handleSheetChange", index);
    if (index === -1) {
      setSheetOpen(false);
    }
  }, []);

  const renderFooter = useCallback(() => {
    return (
      <View style={styles.footerContainer}>
        <Button onPress={generateRecipe} color="green">
          Generate Recipe
        </Button>
      </View>
    );
  }, [generateRecipe]);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Recipe Photos</Text>
      </View>
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Photo }) => {
      const photo: Photo = item;
      return (
        <TouchableOpacity
          style={styles.photoCard}
          activeOpacity={0.85}
          key={photo.id}
          onPress={() => showImage(photo.file.uri)}
        >
          <Image source={{ uri: photo.file.uri }} style={styles.photoImage} />
        </TouchableOpacity>
      );
    },
    [showImage]
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableOverDrag={false}
      onChange={handleSheetChange}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <BottomSheetView style={styles.sheetContainer}>
        {savedPhotos.length > 0 ? (
          <BottomSheetFlashList
            contentContainerStyle={styles.listContentContainer}
            data={savedPhotos as any}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            estimatedItemSize={180}
          ></BottomSheetFlashList>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No photos saved yet</Text>
            <Text style={styles.emptySubtitle}>
              Swipe right on photos in Food List to add them here
            </Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    backgroundColor: "#A1A1AA",
    width: 48,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 4,
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 14,
    color: "#687076",
  },
  photoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  photoImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#687076",
    textAlign: "center",
  },
});
