import {
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  View,
  Text,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FlashList } from "@shopify/flash-list";
import { usePhotoContext } from "@/context/PhotoContext/usePhotoContext";
import { useCallback, useEffect, useState } from "react";
import { Directory, Paths } from "expo-file-system/next";
import useAppStore, { Photo } from "@/components/store/useAppStore";
import { SafeAreaView } from "react-native-safe-area-context";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import HapticPressable from "@/components/HapicPressable";

// TODO split out into own component
const PhotoList = () => {
  // TODO remove context
  // const { photos, setPhotos } = usePhotoContext();

  const zPhotos = useAppStore((state) => state.photos);
  const sortedZPhotos = [...zPhotos].sort((a: Photo, b: Photo) => {
    return (new Date(b.date) as any) - (new Date(a.date) as any);
  });

  return (
    <View style={styles.container}>
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
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        renderLeftActions={LeftAction}
      >
        <View style={{ flexDirection: "row", padding: 8 }}>
          <Image
            source={{ uri: item.file.uri }}
            style={{ width: 100, height: 100, borderRadius: 25 }}
          ></Image>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 8,
            }}
          >
            <Text>Hello</Text>
            <Text>{item.date}</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 120 }],
    };
  });
  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.leftAction}>
        <HapticPressable
          onHapticPressed={(ev) => console.log("Haptic pressed outsite")}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // gap: 8,
              margin: 16,
            }}
          >
            <Text
              style={{
                alignContent: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Delete
            </Text>
            <IconSymbol size={35} name="trash" color={"#FFF"} />
          </View>
        </HapticPressable>
      </View>
    </Reanimated.View>
  );
};

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 140 }],
    };
  });
  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.rightAction}>
        <HapticPressable
          onHapticPressed={(ev) => console.log("Haptic pressed outsite")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
              }}
            >
              Add to recipe
            </Text>
            <IconSymbol size={35} name="plus.square.on.square" color={"#FFF"} />
          </View>
        </HapticPressable>
      </View>
    </Reanimated.View>
  );
};

export default function TabTwoScreen() {
  const { photos, setPhotos } = usePhotoContext();
  const zPhotos = useAppStore((state) => state.photos);

  console.log("zPhotos");
  console.log(zPhotos);
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
    <SafeAreaView style={styles.container}>
      {zPhotos.length > 0 ? (
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
  leftAction: {
    width: 120,
    height: "100%",
    backgroundColor: "#fc032c",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  rightAction: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: "100%",
    backgroundColor: "green",
  },
  swipeable: {
    backgroundColor: "papayawhip",
  },
});
