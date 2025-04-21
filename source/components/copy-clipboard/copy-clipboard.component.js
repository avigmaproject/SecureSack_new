import React from 'react';
import {View, Clipboard, TouchableOpacity} from 'react-native';
import {Toast} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CopyClipboard = ({text, editable}) => (
  <View>
    {editable ? (
      <TouchableOpacity onPress={() => copyToClipboard(text)}>
        <Icon name="content-copy" size={20} color={'rgb(33, 47, 60)'} />
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

const copyToClipboard = (text) => {
  if (text !== undefined || text !== null || text !== '') {
    console.log('Text: ', text);
    Clipboard.setString(text);
    Toast.show({
      text: 'Copied to clipboard',
      position: 'bottom',
      type: 'success',
      duration: 5000,
    });
  } else {
    Toast.show({
      text: 'Nothing to copy',
      position: 'bottom',
      type: 'warning',
      duration: 5000,
    });
  }
};

export default CopyClipboard;
