import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const PhoneNumberRow = ({ number, iconColor = '#87CEEB' }) => {
  const handlePress = () => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 1 }}>
      <MaterialIcons name="phone-in-talk" size={15} color={iconColor} />
      <Text style={{ fontWeight: 'bold', marginLeft: 5,  fontSize: 12 }}>{number}</Text>
    </TouchableOpacity>
  );
};

PhoneNumberRow.propTypes = {
  number: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
};

export default PhoneNumberRow;
