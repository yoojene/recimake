import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
} from "react-native";
import { useCallback, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoList } from "@/components/PhotoList/PhotoList";
import PhotoListBottomSheet from "@/components/PhotoList/PhotoListBottomSheet";
import Button from "@/components/ui/Button/Button";
export default function FoodList() {
  const photos = useAppStore((state) => state.photos);

  const bottomSheetRef = useAppStore((state) => state.bottomSheetRef);

  const sheetOpen = useAppStore((state) => state.sheetOpen);
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

  return (
    <SafeAreaView style={styles.container}>
      {photos.filter((p) => p.status === "new").length > 0 ? (
        <>
          <ScrollView
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
            {photos.filter((p) => p.status === "saved").length > 0 ? (
              <>
                <Text className="text-green-500 font-bold text-2xl">
                  No more new photos to add to recipe
                </Text>

                <Button
                  onPress={() => {
                    setSheetOpen(true);
                    bottomSheetRef?.current?.present();
                    if (sheetOpen) {
                      bottomSheetRef?.current?.close();
                      setSheetOpen(false);
                    }
                  }}
                  backgroundColor="bg-green-500"
                >
                  {sheetOpen ? "Close Recipe List" : "Open Recipe List"}
                </Button>
              </>
            ) : (
              <>
                <Text className="text-black-500 font-bold text-2xl">
                  No photos saved
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
  },

  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
