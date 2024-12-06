import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window");

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={require('@/assets/images/welcome.png')} />
        <View style={styles.button_container}>
          <Image style={styles.tourist_text} source={require('@/assets/images/Trst_text.png')} />
          <TouchableOpacity onPress={() => router.push("/(modals)/login")} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(modals)/signup")} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: 100,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    maxWidth: 200,
    maxHeight: 200,
    marginBottom: 80,
  },
  button_container: {
    width: "80%",
    maxWidth: 240,
    alignItems: "center",
  },
  button: {
    borderRadius: 30,
    borderWidth: 2,
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
    borderColor: Colors.primary,
    marginBottom: 25,
  },
  buttonText: {
    fontSize: Math.min(21, screenWidth * 0.05), // Dynamically adjust font size based on screen width
    textAlign: "center",
    paddingHorizontal: 10, // Ensure some horizontal padding
  },
  wave_image: {
    width: "110%",
    position: "absolute",
    height: 300,
    top: 0,
  },
  tourist_text: {
    marginBottom: 25,
    width: "100%",
    resizeMode: "contain",
  },
});

export default WelcomeScreen;
