import React from 'react';
import { TouchableOpacity, Text, Image, View } from 'react-native';

const CustomButton = ({ onPress, title, imageSource }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#93C5FD',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 1,
        flexDirection: 'row', // Allows image and text to be side by side
        alignItems: 'center', // Centers image and text vertically
      }}
      onPress={onPress}
    >
      {imageSource && (
        <Image
          source={imageSource}
          style={{
            width: 16,
            height: 16,
            marginRight: 5, // Adds space between image and text if image is present
          }}
          resizeMode="contain"
        />
      )}
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
