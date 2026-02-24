import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";

const MOCK_RECIPES = [
  {
    id: "mock-1",
    title: "Roasted Veg Traybake",
    summary: "A simple one-tray dinner with seasonal veg and herbs.",
    createdAt: "Today",
  },
  {
    id: "mock-2",
    title: "Creamy Tomato Pasta",
    summary: "Quick midweek pasta with garlic, tomato, and basil.",
    createdAt: "Yesterday",
  },
];

export default function RecipesListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="chevron.right"
            size={26}
            color="#0a7ea4"
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.headerTitle}>
          Recipe List
        </ThemedText>

        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.introCard}>
          <ThemedText type="title" style={styles.introTitle}>
            Your generated recipes
          </ThemedText>
          <ThemedText style={styles.introSubtitle}>
            This is a stub list for now. New AI-generated recipes will appear
            here once recipe saving is wired up.
          </ThemedText>
        </View>

        <View style={styles.sectionHeaderRow}>
          <ThemedText type="subtitle">Recent</ThemedText>
          <ThemedText style={styles.sectionCount}>
            {MOCK_RECIPES.length}
          </ThemedText>
        </View>

        {MOCK_RECIPES.map((recipe) => (
          <View key={recipe.id} style={styles.recipeCard}>
            <View style={styles.recipeRow}>
              <View style={styles.recipeIconWrap}>
                <IconSymbol name="fork.knife" size={20} color="#0a7ea4" />
              </View>
              <View style={styles.recipeTextWrap}>
                <ThemedText style={styles.recipeTitle}>
                  {recipe.title}
                </ThemedText>
                <ThemedText style={styles.recipeSummary}>
                  {recipe.summary}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.recipeTimestamp}>
              {recipe.createdAt}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    textAlign: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  backIcon: {
    transform: [{ rotate: "180deg" }],
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 16,
  },
  introTitle: {
    marginBottom: 6,
  },
  introSubtitle: {
    color: "#687076",
    lineHeight: 20,
  },
  sectionHeaderRow: {
    marginTop: 6,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCount: {
    fontSize: 13,
    color: "#687076",
    fontWeight: "600",
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
  },
  recipeTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#11181C",
  },
  recipeSummary: {
    marginTop: 2,
    fontSize: 13,
    color: "#687076",
  },
  recipeTimestamp: {
    marginTop: 8,
    marginLeft: 46,
    fontSize: 12,
    color: "#9CA3AF",
  },
});
