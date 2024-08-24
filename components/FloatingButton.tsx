import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const FloatingButton: React.FC = () => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={()=> router.push('/plans')}>
      <Text style={styles.buttonText}>Get</Text>
      <Text style={styles.buttonText}>Plan</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30, // Adjust this value as needed
    alignSelf: 'center',
    backgroundColor: Colors.secondary, // Button color
    borderRadius: 50, // Makes the button round
    width: 80, // Button width
    height: 80, // Button height
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FloatingButton;
