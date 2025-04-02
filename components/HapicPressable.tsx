import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

interface HapticPressableProps {
  children: React.ReactNode;
  onHapticPressed?: (ev: any) => void;
}
export const HapticPressable = ({
  children,
  onHapticPressed,
}: HapticPressableProps) => {
  return (
    <PlatformPressable
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onHapticPressed?.(ev);
        }
      }}
    >
      {children}
    </PlatformPressable>
  );
};

export default HapticPressable;
