import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const TripCompletedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
      <View style={styles.innerContainer}>
        <Image source={require('@/assets/images/check_mark.png')} />
        <View style={styles.button_container}>
          <Text style={styles.successText}>
            Trip Completed Successfully
          </Text>
          <TouchableOpacity onPress={() => router.push("/home")} style={styles.button}>
            <Text style={styles.buttonText}>
              Continue to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
    gap: 20,
  },
  button_container: {
    width: 240,
    gap: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 30,
    borderWidth: 2,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 21,
  },
  wave_image: {
    width: "110%",
    position: "absolute",
    height: 300,
    top: 0,
  },
  successText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TripCompletedScreen;
