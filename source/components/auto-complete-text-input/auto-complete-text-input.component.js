import React, {Component} from 'react';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import Autocomplete from '../auto-complete-lib/auto-complete.component';

import styles from './auto-complete-text-input.style';

class AutoCompleteText extends Component {
  renderLable = (item, i) => {
    if (this.props.value === undefined) return;
    console.log({
      d: this.props.value,
      l: this.props.value.length,
    });
    return (
      <TouchableOpacity
        // onPress={() => alert('sss')}
        onPress={() => this.props.onPress(item)}
        style={styles.labelView}>
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  find = (val, array) => {
    if (val === '' || val === undefined) {
      return [];
    }
    const regex = new RegExp(`${val.trim()}`, 'i');
    const arr = array.filter((array) => array.label.search(regex) >= 0);
    return arr;
  };

  render() {
    const {
      placeholder,
      onChangeText,
      value,
      keyboardType,
      editable,
      color,
      array,
      show,
      hideResult,
      clicked,
    } = this.props;
    console.log('hideresult-', hideResult);
    const arr = this.find(value, array);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const add = {label: 'Add'};

    // let containerStyle = null;
    // if (Platform.OS === 'android') {
    //   containerStyle = {
    //     flex: 1,
    //     left: 0,
    //     position: 'absolute',
    //     right: 0,
    //     top: 0,
    //     zIndex: 1,
    //   };
    // }

    const data =
      (arr.length === 1 && comp(value, arr[0].label)) || clicked
        ? []
        : [...arr, add];

    return (
      <Autocomplete
        label={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        disabled={editable}
        style={styles.input}
        selectionColor={color}
        theme={{colors: {primary: color}}}
        underlineColor={'rgb(33, 47, 60)'}
        data={data}
        renderItem={({item, i}) => this.renderLable(item, i)}
        disable={editable}
        // containerStyle={containerStyle}
        listContainerStyle={{
          flex: 1,
        }}
      />
    );
  }
}

export default AutoCompleteText;
