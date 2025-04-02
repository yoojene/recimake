import { ThemedText } from "@/components/ThemedText";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import { usePhotoLibrary } from "@/hooks/usePhotoLibrary";
import useAppStore from "@/store/useAppStore";
import { Directory, File } from "expo-file-system/next";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const reset = useAppStore((state) => state.reset);

  const { listFiles, deleteDirectory } = usePhotoLibrary();

  const [photos, setPhotos] = useState<(Directory | File)[]>();

  type ItemProps = {
    title: string;
    id: number;
    icon: IconSymbolName;
    function?: () => void;
  };

  const DATA: ItemProps[] = [
    {
      id: 1,
      title: "Clear Store",
      icon: "trash",
      function: () => {
        reset();
        deleteDirectory("photos");

        console.log("store cleared");
      },
    },
    {
      id: 2,
      title: "List Files",
      icon: "list.bullet.below.rectangle",
      function: async () => {
        console.log("List files");
        const list = await listFiles();

        console.log(list);

        setPhotos(list);
      },
    },
  ];

  const renderItem = ({ item }: { item: ItemProps }) => (
    <View>
      <Pressable
        onPress={item.function}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 16,
        }}
      >
        <IconSymbol size={35} name={item.icon} color={"#000"} />

        <Text>{item.title}</Text>
      </Pressable>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="subtitle">Settings</ThemedText>

      <ThemedText type="default">Debugging</ThemedText>

      <FlatList
        contentContainerStyle={{
          justifyContent: "flex-start",
        }}
        style={{
          marginTop: 20,
          width: "auto",
        }}
        renderItem={renderItem}
        data={DATA}
        keyExtractor={(item) => item.id.toString()}
      />

      {photos && photos.length > 0 && (
        <>
          <FlatList
            data={photos}
            keyExtractor={(item) => item.name}
            renderItem={({ item }: any) => (
              <View>
                <Text>{item.type}</Text>
                <Text>{item.uri}</Text>
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    // borderRadius: 50,
                  }}
                ></Image>
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
