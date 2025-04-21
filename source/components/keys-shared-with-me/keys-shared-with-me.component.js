import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Title, Caption, TouchableRipple, Text} from 'react-native-paper';

import styles from './keys-shared-with-me.style';

const KeysSharedWithMe = ({list, navigation, onImport, onUnlink}) => (
  <View style={styles.view}>
    <View style={styles.container}>
      <View style={styles.titleIcon}>
        <Title style={styles.title}>Keys Shared With Me</Title>
        <TouchableOpacity
          style={styles.addView}
          onPress={() =>
            navigate('KeySharedWithMe', navigation)
          }></TouchableOpacity>
      </View>
      <FlatList
        data={list.sharedKeys}
        renderItem={({item}) => keyList(item, navigation, onImport, onUnlink)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  </View>
);

const keyList = (item, navigation, onImport, onUnlink) => {
  console.log('Shared: ', item);
  return (
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .32)" >
      <View>
        <View style={styles.titleSubTitle}>
          <Title style={styles.catTitle}>{item.name}</Title>
          <Caption>{item.ownerName}</Caption>
          <View style={styles.arrowView}>
            {item.lockCode ? (
              <TouchableOpacity onPress={() => onUnlink(item.id)}>
                <Icon name="close" color="rgb(33, 47, 60)" size={15} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onImport(item.id)}>
                <MaterialIcons
                  name="import-export"
                  color="rgb(33, 47, 60)"
                  size={25}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const navigate = (page, navigation, item) => {
  navigation.navigate(page, {data: item});
};

export default KeysSharedWithMe;
