import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/AntDesign';
import {Title, Caption, TouchableRipple, Text} from 'react-native-paper';
import CopyClipboard from '../copy-clipboard/copy-clipboard.component';

import styles from './my-keys.style';

const MyKeys = ({keyList, navigation, onPress}) => (
  <View style={styles.view}>
    <View style={styles.container}>
      <View style={styles.titleIcon}>
        <Title style={styles.title}>My Keys</Title>
        <TouchableOpacity style={styles.addView} onPress={onPress}>
          <Icon name="plus" color="rgb(33, 47, 60)" size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={keyList.keys}
        renderItem={({item}) => myKeyList(item, navigation, keyList)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  </View>
);

const myKeyList = (item, navigation, keyList) => {
  return (
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .32)"
      onPress={() => navigate('MyKey', navigation, item, keyList)}>
      <View>
        <View style={styles.titleSubTitle}>
          <Title style={styles.catTitle}>{item.name}</Title>
          {/* <Caption>{item.code}</Caption> */}
          <View style={styles.arrowView}>
            <SimpleLineIcons
              name="right"
              color="rgb(33, 47, 60)"
              size={15}
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const navigate = (page, navigation, item, keyList) => {
  navigation.navigate(page, {data: item, keyList: keyList.keys});
};

export default MyKeys;
