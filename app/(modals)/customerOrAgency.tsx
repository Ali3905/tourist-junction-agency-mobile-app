import { StyleSheet, Text, View, SafeAreaView, Image, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const customerOrAgency = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
      <View style={styles.innerContainer}>
        <Image style={styles.image} source={require('@/assets/images/welcome.png')} />
        <View style={styles.button_container}>
          <Image style={{ marginBottom: 10 }} source={require('@/assets/images/Trst_text.png')} />
          <TouchableOpacity onPress={() => router.push("/(modals)/welcome")} style={styles.button}>
            <Text style={styles.buttonText} numberOfLines={1}>
              Start as a Agency
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(modals)/(customer)/welcome")} style={styles.button}>
            <Text style={styles.buttonText}>
              Start as a Customer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window'); // Get the screen width
const responsiveFontSize = width * 0.05; // Adjust font size based on screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    gap: 80,
    paddingBottom: 100,
  },
  image: {
    width: 200,
    height: 200,
  },
  button_container: {
    width: 200,
    gap: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    borderWidth: 2,
    paddingVertical: 5,
    alignItems: 'center',
    width: '100%',
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: responsiveFontSize, // Use responsive font size
    flexWrap: 'wrap', // Allow text to wrap
    textAlign: 'center', // Center text alignment
  },
  wave_image: {
    width: '110%',
    height: 300,
    position: 'absolute',
    top: 0,
  },
});

export default customerOrAgency;
