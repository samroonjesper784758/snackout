import React, { useRef } from "react";
import { BottomSheet } from "@/components";
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { BottomSheetMethods } from "@/components/BottomSheet/BottomSheet";

const Home = () => {
  const BottomSheetRef = useRef<BottomSheetMethods>(null);

  const expandHandler = () => {
    BottomSheetRef.current?.expand();
  };

  const closeHandler = () => {
    BottomSheetRef.current?.close();
  };

  return (
    <>
      <SafeAreaProvider
        style={{
          flex: 1,
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Button
                color={"transparent"}
                title="expand"
                onPress={expandHandler}
              />
            </View>
            <BottomSheet
              ref={BottomSheetRef}
              snapTo="75%"
              backgroundColor="white"
            >
              <View
                style={{
                  paddingHorizontal: 24,
                }}
              >
                {[...Array(20)].map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          marginBottom: 10,
                          backgroundColor: "yellow",
                          borderRadius: 12,
                        }}
                        source={{
                          uri: "https://media.licdn.com/dms/image/D4D03AQEgmtN6iwFwcw/profile-displayphoto-shrink_200_200/0/1667807535104?e=2147483647&v=beta&t=Do8I0LmyIo2F6chX1caPfFwysELrFbaV-43WZnbDbTU",
                        }}
                      />
                      <View>
                        <Text>Item number {index}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </BottomSheet>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default Home;
