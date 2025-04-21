import React from 'react';
import {Item} from 'native-base';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import styles from './input-text-add.style';

const InputTextAdd = ({placeholder, onChangeText, value, onAdd}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      placeholderTextColor="#212F3C"
      onChangeText={onChangeText}
      value={value}
      color="#212F3C"
    />
    <TouchableOpacity onPress={onAdd}>
      <View style={styles.iconBackgroundView}>
        <Icon size={20} color="white" name={'plus'} />
      </View>
    </TouchableOpacity>
  </View>
);

export default InputTextAdd;
