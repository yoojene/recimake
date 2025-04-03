import useAppStore from "@/store/useAppStore";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { View, StyleSheet, Text, Image } from "react-native";

import HapticPressable from "../HapicPressable";
import { IconSymbol } from "../ui/IconSymbol";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Photo } from "@/models/Photo.model";
import { usePhotoLibrary } from "@/hooks/usePhotoLibrary";
import { useState } from "react";

export function PhotoList() {
  const photos = useAppStore((state) => state.photos);
  const [statusChange, setStatusChange] = useState<boolean>(false); // Used to trigger FlashList re-render

  const sortedPhotos = [...photos].sort((a: Photo, b: Photo) => {
    return (new Date(b.date) as any) - (new Date(a.date) as any);
  });

  return (
    <View style={styles.container}>
      <FlashList
        data={sortedPhotos}
        renderItem={(item) =>
          renderItem({
            item: item,
            extraData: {
              setStatusChange: setStatusChange,
              statusChange: statusChange,
            },
          })
        }
        estimatedItemSize={200}
        extraData={statusChange}
      />
    </View>
  );
}

const renderItem = ({
  item: item,
  extraData: { setStatusChange, statusChange },
}: {
  item: ListRenderItemInfo<Photo>;
  extraData: {
    setStatusChange: React.Dispatch<React.SetStateAction<boolean>>;
    statusChange: boolean;
  };
}) => {
  const photoItem: Photo = item.item;
  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(prog, drag) =>
          RightAction(prog, drag, photoItem, setStatusChange, statusChange)
        }
        renderLeftActions={(prog, drag) => LeftAction(prog, drag, photoItem)}
      >
        <View style={{ flexDirection: "row", padding: 8 }}>
          <Image
            source={{ uri: photoItem.file.uri }}
            style={{ width: 100, height: 100, borderRadius: 25 }}
          ></Image>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 8,
            }}
          >
            <Text>{photoItem.status}</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

const LeftAction = (
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: Photo
) => {
  const { deleteFile } = usePhotoLibrary();

  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value - 120 }],
    };
  });
  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.leftAction}>
        <HapticPressable
          onHapticPressed={() => onLeftActionPressed(item, deleteFile)}
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

const onLeftActionPressed = (
  item: Photo,
  deleteFile: (uri: string) => void
) => {
  deleteFile(item.file.uri);
};

const onRightActionPressed = (
  item: Photo,
  setPhotoStatus: (status: "new" | "saved", id: string) => void,
  setStatusChange: React.Dispatch<React.SetStateAction<boolean>>,
  statusChange: boolean
) => {
  console.log("Right action pressed");
  setPhotoStatus("saved", item.id);
  setStatusChange(!statusChange);
  // TODO add to recipe
};

const RightAction = (
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: Photo,
  setStatusChange: React.Dispatch<React.SetStateAction<boolean>>,
  statusChange: boolean
) => {
  const setPhotoStatus = useAppStore((state) => state.setPhotoStatus);

  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 140 }],
    };
  });
  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.rightAction}>
        <HapticPressable
          onHapticPressed={() =>
            onRightActionPressed(
              item,
              setPhotoStatus,
              setStatusChange,
              statusChange
            )
          }
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
