import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {TextInput, PaperProvider} from 'react-native-paper';

import styles from './input-text-icon-dynamic.style';

const InputTextIconDynamic = ({
  placeholder,
  icon,
  onChangeText,
  value,
  right,
  editable,
  color,
  keyboardType,
}) => (
  <View>
    <TextInput
      label={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      disabled={editable}
      style={styles.input}
      selectionColor={color}
      theme={{colors:{primary: color}}}
      underlineColor={'rgb(33, 47, 60)'}
      right={<Icon name={icon}/>}
    />
  </View>
);

export default InputTextIconDynamic;
