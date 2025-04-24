import { Text, Pressable, View } from "react-native";
import { IconSymbol, IconSymbolName } from "../IconSymbol";

// Simple button component with optional icon
interface ButtonProps {
  onPress: () => void;
  backgroundColor?: string;
  backgroundActiveColor?: string;
  textColor?: string;
  icon?: IconSymbolName;
  iconColor?: string;
  children: React.ReactNode;
}

export default function Button({
  onPress,
  children,
  backgroundColor = "bg-blue-500",
  backgroundActiveColor = "bg-blue-400",
  textColor = "text-white",
  icon,
  iconColor,
}: ButtonProps) {
  return (
    <Pressable
      className={`${backgroundColor} hover:bg-blue-700 active:${backgroundActiveColor} text-white font-bold py-4 px-16 rounded`}
      onPress={onPress}
    >
      {({ pressed }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {icon ? (
            <IconSymbol name={icon} color={iconColor}></IconSymbol>
          ) : null}
          <Text className={textColor}>{children}</Text>
        </View>
      )}
    </Pressable>
  );
}
