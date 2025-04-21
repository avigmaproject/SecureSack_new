import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from './input-text-dynamic.style.js';

const InputTextDynamic = ({
  placeholder,
  onChangeText,
  value,
  keyboardType,
  editable = true, // default to true
  color,
  example,
}) => {
  return (
    <View>
      <TextInput
        label={placeholder}
        value={value}
        onChangeText={(text) => {
          console.log('🟢 InputTextDynamic received:', text);
          onChangeText && onChangeText(text);
        }}
        keyboardType={keyboardType}
        disabled={!editable}
        style={styles.input}
        selectionColor={color}
        theme={{ colors: { primary: color } }}
        underlineColor={'rgb(33, 47, 60)'}
        placeholder={example} // will not show if label is used
      />
    </View>
  );
};

export default InputTextDynamic;
