import React from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const OnboardingScreen = () => {
  const handleNext = () => {
    router.push("/(modals)/customerOrAgency");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={require('@/assets/images/onboarding.png')} />
        <Text style={styles.titleText}>
          Find & connect with trusted mechanics near you.
        </Text>
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: screenWidth * 0.05, // 5% padding
    paddingTop: screenHeight * 0.1,        // 10% padding from the top
    paddingBottom: screenHeight * 0.05,    // 5% padding from the bottom
  },
  image: {
    width: screenWidth * 0.5, // 50% of screen width
    height: screenWidth * 0.5, // 50% of screen width (square)
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: 16,
  },
  titleText: {
    fontWeight: "500",
    fontSize: Math.min(18, screenWidth * 0.045), // Dynamically adjust font size
    color: Colors.primary,
    textAlign: "center",
    paddingHorizontal: screenWidth * 0.05, // Responsive padding
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 10,
    width: "85%", // 85% of screen width
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    fontSize: Math.min(21, screenWidth * 0.05), // Dynamically adjust font size
    textAlign: "center",
    paddingHorizontal: 10,
  },
  wave_image: {
    width: "110%",
    position: "absolute",
    height: screenHeight * 0.3, // 30% of screen height
    top: 0,
  },
});

export default OnboardingScreen;
