import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import PhoneNumberRow from './PhoneNumberRow';

const PhoneNumbersList = ({ phoneNumbers }) => {
  const leftColumnNumbers = phoneNumbers.slice(0, 2);
  const rightColumnNumbers = phoneNumbers.slice(2, 4);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {/* Left Column */}
      <View style={{ flex: 1 }}>
        {leftColumnNumbers.map((number, index) => (
          <PhoneNumberRow key={index} number={number} />
        ))}
      </View>

      {/* Right Column */}
      <View style={{ flex: 1 }}>
        {rightColumnNumbers.map((number, index) => (
          <PhoneNumberRow key={index + 2} number={number} />
        ))}
      </View>
    </View>
  );
};

PhoneNumbersList.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PhoneNumbersList;
