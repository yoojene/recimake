import useAppStore from "@/store/useAppStore";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
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
      <View className="flex-1 justify-center items-center mt-4">
        <Button onPress={generateRecipe} color="green">
          Generate Recipe
        </Button>
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: Photo }) => {
    const photo: Photo = item;
    return (
      <TouchableOpacity
        className="border-b-4 border-gray-100 bg-sky-50 items-center p-4"
        key={photo.id}
        onPress={() => showImage(photo.file.uri)}
      >
        <Image
          source={{ uri: photo.file.uri }}
          className="w-36 h-36 rounded-lg"
        />
      </TouchableOpacity>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enableOverDrag={false}
      onChange={handleSheetChange}
      footerComponent={renderFooter}
    >
      <BottomSheetView className="flex-1 bg-white-100">
        {photos && (
          <>
            <BottomSheetFlashList
              contentContainerClassName={"flex-col justify-start p-4"}
              data={photos as any}
              renderItem={renderItem}
              ListFooterComponent={renderFooter}
              estimatedItemSize={98}
            ></BottomSheetFlashList>
          </>
        )}
        {photos.length === 0 && (
          <Text className="text-black-500 font-bold text-2xl text-center">
            No photos saved yet
          </Text>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
