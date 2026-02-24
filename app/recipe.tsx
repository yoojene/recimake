import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useAppStore from "@/store/useAppStore";

const LOADING_STEPS = [
  "Analyzing your photos",
  "Building an AI recipe",
  "Finalising ingredients and steps",
] as const;

type RecipeResult = {
  title: string;
  description: string;
  prep: string;
  cook: string;
  servings: string;
  ingredients: string[];
  steps: string[];
};

const getMockRecipe = (savedCount: number): RecipeResult => {
  const ingredientPrefix =
    savedCount > 0 ? "Based on your latest photos" : "Based on your pantry";

  return {
    title: "Crispy Veggie Pan Wraps",
    description: `${ingredientPrefix}, here’s a balanced weeknight recipe with protein, crunch, and a creamy finish.`,
    prep: "10 min",
    cook: "18 min",
    servings: "2-3",
    ingredients: [
      "2 cups mixed chopped vegetables",
      "1 tbsp olive oil",
      "1 tsp smoked paprika",
      "1/2 tsp garlic powder",
      "Salt and pepper to taste",
      "2 large wraps",
      "1/3 cup Greek yogurt",
      "1 tbsp lemon juice",
    ],
    steps: [
      "Heat oil in a large pan over medium-high heat and add vegetables.",
      "Season with paprika, garlic powder, salt, and pepper, then sauté for 8-10 minutes.",
      "Warm wraps in a dry pan for 30 seconds each side.",
      "Mix yogurt and lemon juice for a quick sauce.",
      "Fill wraps with the veggie mix, drizzle sauce, and serve warm.",
    ],
  };
};

export default function RecipeScreen() {
  const photos = useAppStore((state) => state.photos);
  const savedPhotoCount = photos.filter(
    (photo) => photo.status === "saved"
  ).length;

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const recipe = useMemo(
    () => getMockRecipe(savedPhotoCount),
    [savedPhotoCount]
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhaseIndex(1), 1200));
    timers.push(setTimeout(() => setPhaseIndex(2), 2600));
    timers.push(setTimeout(() => setIsLoading(false), 4100));

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

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
          Recipe Builder
        </ThemedText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText type="subtitle" style={styles.loadingTitle}>
              Creating your recipe...
            </ThemedText>
            <ThemedText style={styles.loadingSubtitle}>
              {LOADING_STEPS[phaseIndex]}
            </ThemedText>
            <View style={styles.stepDotsContainer}>
              {LOADING_STEPS.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index <= phaseIndex ? styles.stepDotActive : undefined,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.recipeCard}>
            <ThemedText type="title" style={styles.recipeTitle}>
              {recipe.title}
            </ThemedText>
            <ThemedText style={styles.recipeDescription}>
              {recipe.description}
            </ThemedText>

            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <ThemedText style={styles.metaLabel}>Prep</ThemedText>
                <ThemedText style={styles.metaValue}>{recipe.prep}</ThemedText>
              </View>
              <View style={styles.metaPill}>
                <ThemedText style={styles.metaLabel}>Cook</ThemedText>
                <ThemedText style={styles.metaValue}>{recipe.cook}</ThemedText>
              </View>
              <View style={styles.metaPill}>
                <ThemedText style={styles.metaLabel}>Serves</ThemedText>
                <ThemedText style={styles.metaValue}>
                  {recipe.servings}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <ThemedText type="subtitle">Ingredients</ThemedText>
            <View style={styles.sectionList}>
              {recipe.ingredients.map((ingredient) => (
                <View style={styles.bulletRow} key={ingredient}>
                  <View style={styles.bullet} />
                  <ThemedText style={styles.bulletText}>
                    {ingredient}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <ThemedText type="subtitle">Steps</ThemedText>
            <View style={styles.sectionList}>
              {recipe.steps.map((step, index) => (
                <View style={styles.stepRow} key={step}>
                  <View style={styles.stepNumberWrap}>
                    <ThemedText style={styles.stepNumber}>
                      {index + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.stepText}>{step}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  loadingTitle: {
    marginTop: 14,
    textAlign: "center",
  },
  loadingSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#687076",
    textAlign: "center",
  },
  stepDotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4D4D8",
  },
  stepDotActive: {
    backgroundColor: "#0a7ea4",
  },
  contentContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 16,
  },
  recipeTitle: {
    marginBottom: 6,
  },
  recipeDescription: {
    color: "#687076",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  metaPill: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingVertical: 10,
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: "#687076",
  },
  metaValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#11181C",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    padding: 16,
  },
  sectionList: {
    marginTop: 10,
    gap: 10,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginTop: 7,
    marginRight: 10,
    backgroundColor: "#0a7ea4",
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    marginRight: 10,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
});
