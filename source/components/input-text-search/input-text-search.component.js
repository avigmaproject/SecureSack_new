import React from 'react';
import {Item} from 'native-base';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import styles from './input-text-search.style';

const InputTextSearch = ({placeholder, onChange, value, onClear}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      placeholder={placeholder}
      placeholderTextColor="#212F3C"
      onChange={onChange}
      value={value}
      color="#212F3C"
    />
    <TouchableOpacity onPress={onClear}>
      <View style={styles.iconBackgroundView}>
        <Icon size={20} color="white" name={value.length !== 0 ? 'close' : 'search1'} />
      </View>
    </TouchableOpacity>
  </View>
);

export default InputTextSearch;
