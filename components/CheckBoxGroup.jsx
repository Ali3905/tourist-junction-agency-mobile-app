import React from 'react';
import { View, Text, CheckBox, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CheckboxGroup = ({ options, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <View key={option.value} style={styles.checkboxWrapper}>
          <CheckBox
            value={selectedValue === option.value}
            onValueChange={() => onValueChange(option.value)}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

CheckboxGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default CheckboxGroup;
