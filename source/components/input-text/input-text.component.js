import React from 'react';
import {TextInput, View} from 'react-native';

import styles from "./input-text.style.js"

const InputText = ({placeholder, onChange, value, keyboardType}) => (
  <View>
    <TextInput 
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      onChange={onChange}
      placeholderTextColor="#FFFFFF"
      value={value}
      keyboardType={keyboardType}
    />
  </View>
);
export default InputText;
