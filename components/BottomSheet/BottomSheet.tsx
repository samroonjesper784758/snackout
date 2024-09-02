import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, {
  Children,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Animated, {
  AnimatedProps,
  AnimatedScrollViewProps,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BackDrop } from "./BackDrop";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends AnimatedProps<AnimatedScrollViewProps> {
  snapTo: string;
  backgroundColor?: string;
}

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(
  ({ snapTo, backgroundColor, children, ...rest }: Props, ref) => {
    const { height } = Dimensions.get("screen");
    const closeHeight = height;
    const inset = useSafeAreaInsets();
    const percentage = parseFloat(snapTo.replace("%", "")) / 100;
    const openHeight = height - height * percentage;
    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);
    const scrollBegin = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const [enableScroll, setEnableScroll] = useState(true);

    const expand = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(openHeight);
    }, [openHeight, topAnimation]);

    const close = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(closeHeight);
    }, [closeHeight, topAnimation]);

    useImperativeHandle(ref, () => ({ expand, close }), [expand, close]);

    const animatedStyle = useAnimatedStyle(() => {
      const top = topAnimation.value;
      return {
        top,
      };
    });

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(event.translationY + context.value, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: (event) => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          runOnJS(setEnableScroll)(true);
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
          topAnimation.value = withSpring(event.translationY + context.value, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    const scrollViewGesture = Gesture.Native();

    return (
      <>
        {/* <BackDrop
          topAnimation={topAnimation}
          closeHeight={closeHeight}
          openHeight={openHeight}
          close={close}
        /> */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.container,
              animatedStyle,
              { backgroundColor: backgroundColor, paddingBottom: inset.bottom },
            ]}
          >
            <View style={styles.lineContainer}>
              <View style={styles.line} />
            </View>
            <GestureDetector
              gesture={Gesture.Simultaneous(panScroll, scrollViewGesture)}
            >
              <Animated.ScrollView
                {...rest}
                scrollEnabled={enableScroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
              >
                {children}
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  lineContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: "black",
    borderRadius: 20,
  },
});

export default BottomSheet;
