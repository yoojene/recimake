import { router } from "expo-router";
import useAppStore from "@/store/useAppStore";

export function useRecipe() {
  const bottomSheetRef = useAppStore((state) => state.bottomSheetRef);
  const setSheetOpen = useAppStore((state) => state.setSheetOpen);

  const generateRecipe = () => {
    bottomSheetRef?.current?.dismiss();
    setSheetOpen(false);
    router.push("/recipe");
  };

  return {
    generateRecipe,
  };
}
