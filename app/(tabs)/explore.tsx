import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  RefreshControl,
  View,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FlashList } from "@shopify/flash-list";
import { usePhotoContext } from "@/context/PhotoContext/usePhotoContext";
import { useCallback, useEffect, useState } from "react";
import { Directory, Paths } from "expo-file-system/next";
import useAppStore from "@/components/store/useStore";

const PhotoList = () => {
  const { photos, setPhotos } = usePhotoContext();
  const zPhotos = useAppStore((state) => state.photos);

  const sortedZPhotos = [...zPhotos].sort((a, b) => {
    return (new Date(b.date) as any) - (new Date(a.date) as any);
  });

  console.log("sortedZPhotos");
  console.log(sortedZPhotos);

  return (
    <View style={styles.container}>
      <ThemedText> {photos.length} </ThemedText>

      <FlashList
        data={photos}
        renderItem={({ item }: { item: any }) => (
          <View style={{ flexDirection: "row", padding: 8 }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: 150, height: 150 }}
            ></Image>
          </View>
        )}
        estimatedItemSize={200}
      />
      <ThemedText> ZPhotos </ThemedText>
      <ThemedText> {zPhotos.length} </ThemedText>

      <FlashList
        data={sortedZPhotos}
        renderItem={renderItem}
        estimatedItemSize={200}
      />
    </View>
  );
};

const renderItem = ({ item }: { item: any }) => {
  return (
    <View style={{ flexDirection: "row", padding: 8 }}>
      <Image
        source={{ uri: item.file.uri }}
        style={{ width: 150, height: 150 }}
      ></Image>
    </View>
  );
};

export default function TabTwoScreen() {
  const { photos, setPhotos } = usePhotoContext();

  useEffect(() => {
    const photosDir = new Directory(Paths.document, "photos");
    if (!photosDir.exists) {
      return;
    }

    const files = photosDir.list();

    console.log(files);

    setPhotos(files);
  }, []);

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
    <>
      {photos.length > 0 ? (
        <ScrollView
          style={styles.container}
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
    </>
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
    padding: 8,
  },

  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
