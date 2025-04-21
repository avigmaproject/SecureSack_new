import React from 'react';
import {Item} from 'native-base';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './input-text-icon.style';

const InputTextIcon = ({
  placeholder,
  icon,
  onChange,
  value,
  show,
  onPress,
  ...props
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      secureTextEntry={show}
      placeholderTextColor="#FFFFFF"
      onChange={onChange}
      value={value}
      {...props}
    />
    <TouchableOpacity onPress={onPress}>
      <Icon size={24} color="white" name={icon} style={styles.iconStyle} />
    </TouchableOpacity>
  </View>
);

export default InputTextIcon;

