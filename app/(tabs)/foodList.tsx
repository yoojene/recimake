import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useCallback, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoList } from "@/components/PhotoList/PhotoList";
import PhotoListBottomSheet from "@/components/PhotoList/PhotoListBottomSheet";
import Button from "@/components/ui/Button/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";

export default function FoodList() {
  const photos = useAppStore((state) => state.photos);
  const newPhotos = photos.filter((p) => p.status === "new");
  const savedPhotos = photos.filter((p) => p.status === "saved");

  const bottomSheetRef = useAppStore((state) => state.bottomSheetRef);

  const setSheetOpen = useAppStore((state) => state.setSheetOpen);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log("refreshing");
    console.log(photos);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [photos]);

  const openSavedPhotos = () => {
    setSheetOpen(true);
    bottomSheetRef?.current?.present();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Food List</Text>
          <Text style={styles.headerSubtitle}>
            Swipe left to delete • Swipe right to add to recipe
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerIconButton}
          activeOpacity={0.8}
          onPress={openSavedPhotos}
          disabled={savedPhotos.length === 0}
        >
          <IconSymbol
            name="photo.stack.fill"
            size={24}
            color={savedPhotos.length === 0 ? "#9BA1A6" : "#0a7ea4"}
          />
        </TouchableOpacity>
      </View>
      {newPhotos.length > 0 ? (
        <>
          <ScrollView
            style={styles.listScrollView}
            contentContainerStyle={styles.listContentContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <PhotoList />
          </ScrollView>
          <PhotoListBottomSheet />
        </>
      ) : (
        <>
          <View style={styles.noPhotosContainer}>
            {savedPhotos.length > 0 ? (
              <>
                <Text style={styles.emptyTitleSuccess}>All caught up</Text>
                <Text style={styles.emptySubtitle}>
                  No new photos to review right now.
                </Text>
                <Button
                  className="mt-4"
                  onPress={() => {
                    router.push("/recipes");
                  }}
                  color={"green"}
                >
                  Open Recipe List
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.emptyTitle}>No photos yet</Text>
                <Text style={styles.emptySubtitle}>
                  Capture a photo from Home to start building your recipe list.
                </Text>
              </>
            )}
          </View>
          <PhotoListBottomSheet />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#11181C",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#687076",
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  listScrollView: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 16,
  },

  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#11181C",
    textAlign: "center",
  },
  emptyTitleSuccess: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A7F37",
    textAlign: "center",
  },
  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#687076",
    textAlign: "center",
    maxWidth: 320,
  },

  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "red",
  },
});
