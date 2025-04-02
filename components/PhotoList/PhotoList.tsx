import useAppStore from "@/store/useAppStore";
import { FlashList } from "@shopify/flash-list";
import { View, StyleSheet, Text, Image } from "react-native";
import { ThemedText } from "../ThemedText";

import HapticPressable from "../HapicPressable";
import { IconSymbol } from "../ui/IconSymbol";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Photo } from "@/models/Photo.model";

export function PhotoList() {
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
}

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

const LeftAction = (
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: any
) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 120 }],
    };
  });
  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.leftAction}>
        <HapticPressable
          onHapticPressed={(ev) => onLeftActionPressed(ev, item)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
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

const onLeftActionPressed = (ev: any, item: any) => {
  console.log("Delete pressed");
  console.log(ev);
  console.log(item);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
