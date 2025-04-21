import React from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';

import styles from './multiline-input-text.style.js';

const MultilineInput = ({
  placeholder,
  onChangeText,
  value,
  keyboardType,
  color,
  example,
  onChange
}) => (
  <View>
    <TextInput
      label={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      style={styles.input}
      selectionColor={color}
      theme={{colors: {primary: color}}}
      underlineColor={'rgb(33, 47, 60)'}
      placeholder={example}
      multiline={true}
    />
  </View>
);
export default MultilineInput;
