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
          <Text style={styles.buttonText}>
            Get Started
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: screenHeight * 0.1,
    paddingBottom: screenHeight * 0.05,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: 16,
  },
  titleText: {
    fontWeight: "500",
    fontSize: Math.min(18, screenWidth * 0.045),
    color: Colors.primary,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 10,
    width: "85%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    fontSize: Math.min(21, screenWidth * 0.05),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  wave_image: {
    width: "110%",
    position: "absolute",
    height: screenHeight * 0.3,
    top: 0,
  },
});

export default OnboardingScreen;