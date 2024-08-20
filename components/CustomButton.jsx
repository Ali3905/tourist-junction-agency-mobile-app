import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'skyblue',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 10, // For spacing between buttons
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
