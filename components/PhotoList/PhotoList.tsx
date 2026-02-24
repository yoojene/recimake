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
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export function PhotoList() {
  const swipeableRef = useRef(null);

  const photos = useAppStore((state) => state.photos);
  const [statusChange, setStatusChange] = useState<boolean>(false); // Used to trigger FlashList re-render
  const bottomSheetRef = useAppStore((state) => state.bottomSheetRef);

  const sortedPhotos = [...photos]
    .sort((a: Photo, b: Photo) => {
      return (new Date(b.date) as any) - (new Date(a.date) as any);
    })
    .filter((p) => p.status === "new");

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
              bottomSheetRef: bottomSheetRef,
              swipeableRef: swipeableRef,
            },
          })
        }
        estimatedItemSize={200}
        extraData={statusChange}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const formatPhotoDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const renderItem = ({
  item: item,
  extraData: { setStatusChange, statusChange, bottomSheetRef, swipeableRef },
}: {
  item: ListRenderItemInfo<Photo>;
  extraData: {
    setStatusChange: React.Dispatch<React.SetStateAction<boolean>>;
    statusChange: boolean;
    bottomSheetRef: React.RefObject<BottomSheetModal> | null;
    swipeableRef: React.RefObject<any>;
  };
}) => {
  const photoItem: Photo = item.item;

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swipeableRef}
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(prog, drag) =>
          RightAction(
            prog,
            drag,
            photoItem,
            setStatusChange,
            statusChange,
            bottomSheetRef,
            swipeableRef
          )
        }
        renderLeftActions={(prog, drag) => LeftAction(prog, drag, photoItem)}
      >
        <View style={styles.rowCard}>
          <Image
            source={{ uri: photoItem.file.uri }}
            style={styles.rowImage}
          ></Image>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>New photo</Text>
            <Text style={styles.rowSubtitle}>
              {formatPhotoDate(photoItem.date)}
            </Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Ready to review</Text>
            </View>
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
    <Reanimated.View style={[styleAnimation, styles.leftActionWrapper]}>
      <View style={styles.leftAction}>
        <HapticPressable
          onHapticPressed={() => onLeftActionPressed(item, deleteFile)}
        >
          <View style={styles.actionContent}>
            <IconSymbol size={34} name="trash" color={"#FFF"} />
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
  statusChange: boolean,
  bottomSheetRef: React.RefObject<BottomSheetModal> | null,
  swipeableRef: React.RefObject<any>
) => {
  console.log("Right action pressed");
  setPhotoStatus("saved", item.id);

  setStatusChange(!statusChange);
  bottomSheetRef?.current?.present();
  swipeableRef.current.close();
};

const RightAction = (
  prog: SharedValue<number>,
  drag: SharedValue<number>,
  item: Photo,
  setStatusChange: React.Dispatch<React.SetStateAction<boolean>>,
  statusChange: boolean,
  bottomSheetRef: React.RefObject<BottomSheetModal> | null,
  swipeableRef: React.RefObject<any>
) => {
  const setPhotoStatus = useAppStore((state) => state.setPhotoStatus);

  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 140 }],
    };
  });
  return (
    <Reanimated.View style={[styleAnimation, styles.rightActionWrapper]}>
      <View style={styles.rightAction}>
        <HapticPressable
          onHapticPressed={() =>
            onRightActionPressed(
              item,
              setPhotoStatus,
              setStatusChange,
              statusChange,
              bottomSheetRef,
              swipeableRef
            )
          }
        >
          <View style={styles.actionContent}>
            <IconSymbol size={34} name="fork.knife" color={"#FFF"} />
          </View>
        </HapticPressable>
      </View>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  listContentContainer: {
    paddingVertical: 8,
  },
  leftActionWrapper: {
    marginVertical: 6,
    borderRadius: 18,
    overflow: "hidden",
  },
  leftAction: {
    width: 120,
    height: "100%",
    backgroundColor: "#fc032c",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  rightActionWrapper: {
    marginVertical: 6,
    borderRadius: 18,
    overflow: "hidden",
  },
  rightAction: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: "100%",
    backgroundColor: "green",
    borderRadius: 18,
  },
  swipeable: {
    borderRadius: 18,
    marginVertical: 6,
    overflow: "hidden",
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    minHeight: 112,
  },
  rowImage: {
    width: 92,
    height: 92,
    borderRadius: 18,
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    gap: 4,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#11181C",
  },
  rowSubtitle: {
    fontSize: 13,
    color: "#687076",
  },
  statusPill: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E9F8EE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    color: "#1A7F37",
    fontWeight: "600",
    fontSize: 12,
  },
  actionContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
