import React, {
  createContext,
  forwardRef,
  ReactNode,
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// Full screen image viewer with zoom functionality
// Ref: https://blog.andrewmchester.com/react-native-expo-full-screen-image-viewer-with-zoom-made-simple/

const ImageContext = createContext<ImageContextValue>(null!);

type ImageProviderProps = {
  children: ReactNode;
};

type ImageContextValue = {
  showImage: (imageUri: string) => void;
};

export default function ImageProvider({ children }: ImageProviderProps) {
  const imageRef = useRef<any>();

  const showImage = (imageUri: string) => {
    imageRef.current?.show(imageUri);
  };

  return (
    <ImageContext.Provider value={{ showImage }}>
      {children}
      <ImageView ref={imageRef} />
    </ImageContext.Provider>
  );
}

const ImageView = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const imageUriRef = useRef("");

  useImperativeHandle(ref, () => ({
    hide: () => {
      imageUriRef.current = "";
      setShow(false);
    },
    show: (uri = "") => {
      imageUriRef.current = uri;
      setShow(true);
    },
  }));

  if (!show) return null;

  const hide = () => {
    setShow(false);
    imageUriRef.current = "";
  };

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayBackground} />
      <View style={styles.overlayContent}>
        <TouchableOpacity style={styles.closeButton} onPress={hide}>
          <FontAwesome name="close" size={50} color="lightblue" />
        </TouchableOpacity>
        <Zoomable isDoubleTapEnabled>
          <Image
            source={{ uri: imageUriRef.current }}
            contentFit="contain"
            style={styles.fullScreenImage}
          />
        </Zoomable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000000,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(90, 90, 90, 0.95)",
  },
  overlayContent: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 10,
    padding: 5,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    zIndex: 100001,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
}
