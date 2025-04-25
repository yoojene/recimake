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
  className?: string;
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
  className,
}: ButtonProps) {
  const defaultClasses = `${backgroundColor} active:${backgroundActiveColor} text-white font-bold py-4 px-16 rounded-md`;

  return (
    <Pressable
      className={
        className ? `${defaultClasses} ${className}` : `${defaultClasses}`
      }
      onPress={onPress}
      // className="bg-gray-500 active:bg-gray-400 text-white font-bold py-4 px-16 rounded-md"
    >
      <View className="flex-row items-center">
        {icon ? (
          <IconSymbol
            style={{ marginRight: 4 }}
            name={icon}
            color={iconColor}
          ></IconSymbol>
        ) : null}
        <Text className={textColor}>{children}</Text>
      </View>
    </Pressable>
  );
}
