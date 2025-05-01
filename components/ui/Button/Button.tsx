import { Text, Pressable, View } from "react-native";
import { IconSymbol, IconSymbolName } from "../IconSymbol";
import { useState } from "react";

// Simple button component with optional icon
interface ButtonProps {
  onPress: () => void;
  color: string;
  textColor?: string;
  icon?: IconSymbolName;
  iconColor?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  onPress,
  children,
  color,
  textColor = "text-white",
  icon,
  iconColor,
  className,
}: ButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const buttonStyle = isActive ? `bg-${color}-400` : `bg-${color}-500`;

  return (
    <Pressable
      onPressIn={() => setIsActive(true)}
      onPressOut={() => setIsActive(false)}
      onPress={onPress}
      className={`${buttonStyle} text-white font-bold py-4 px-16 rounded-md`}
    >
      <View className="flex-row items-center">
        {icon ? (
          <IconSymbol
            style={{ marginRight: 4 }}
            name={icon}
            color={iconColor}
          />
        ) : null}
        <Text className={textColor}>{children}</Text>
      </View>
    </Pressable>
  );
}
