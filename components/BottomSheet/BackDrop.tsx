import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type Props = {
  topAnimation: SharedValue<number>;
  openHeight: number;
  closeHeight: number;
  close: () => void;
};

export const BackDrop = ({
  topAnimation,
  closeHeight,
  openHeight,
  close,
}: Props) => {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      topAnimation.value,
      [closeHeight, openHeight],
      [0, 0.5]
    );
    const display = opacity === 0 ? "none" : "flex";
    return {
      opacity,
      display,
    };
  });

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, backgroundColor: "pink" }}
      onPress={() => {
        close();
      }}
    >
      <Animated.View
        style={[styles.container, backDropAnimation]}
      ></Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    display: "none",
  },
});
