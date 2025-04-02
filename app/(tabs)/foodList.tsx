import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoList } from "@/components/PhotoList/PhotoList";

export default function FoodList() {
  const photos = useAppStore((state) => state.photos);

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
      {photos.length > 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PhotoList />
        </ScrollView>
      ) : (
        <View style={styles.noPhotosContainer}>
          <ThemedText type="subtitle">No photos saved</ThemedText>
        </View>
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
});
