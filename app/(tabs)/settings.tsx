import { IconSymbol } from "@/components/ui/IconSymbol";
import useAppStore from "@/store/useAppStore";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const reset = useAppStore((state) => state.reset);
  type ItemProps = { title: string; id: number };

  const clearStore = () => {
    reset();
    console.log("store cleared");
  };

  const renderItem = ({ item }: { item: ItemProps }) => (
    <View>
      <Pressable
        onPress={clearStore}
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 16,
        }}
      >
        <IconSymbol size={35} name="trash" color={"#000"} />

        <Text>{item.title}</Text>
      </Pressable>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings</Text>
      <FlatList
        renderItem={renderItem}
        data={[{ id: 1, title: "Clear Store" }]}
        keyExtractor={(item) => item.id.toString()}
      />
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
