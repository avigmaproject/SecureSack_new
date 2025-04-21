import React from 'react';
import {View, Linking, TouchableOpacity} from 'react-native';
import {Toast} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';

const ExternalLink = ({link, editable}) => (
  <View>
    {editable ? (
      <TouchableOpacity onPress={() => openLink(link)}>
        <Icon name="external-link" size={20} color={'rgb(33, 47, 60)'} />
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

const openLink = (link) => {
  console.log('Link: ', link);
  if (link !== undefined && link !== null && link !== '' && link.length > 0) {
    Linking.openURL(`https://${link}`);
  }
};

export default ExternalLink;