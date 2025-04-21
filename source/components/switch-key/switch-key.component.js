import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Text, Chip} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {switchKey} from '../../configuration/api/api.functions';
import styles from './switch-key.style';

const SwitchKey = ({type, recid, shareKeyId, refresh}) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const info = await AsyncStorage.getItem('user_info');
      if (info) {
        const parsed = JSON.parse(info);
        setUserData(parsed);
      }
    };
    loadUser();
  }, []);

  if (!userData || !userData.shareKeys) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={userData.shareKeys}
        renderItem={({item, index}) =>
          renderKey(item, type, recid, shareKeyId, index, userData, refresh)
        }
        horizontal={true}
      />
    </View>
  );
};

const renderKey = (
  item,
  type,
  recid,
  shareKeyId,
  index,
  userData,
  refreshData,
) => (
  <View key={index} style={styles.key}>
    <Chip
      onPress={() => {
        switchTheKey(type, recid, shareKeyId, item.id, userData, refreshData);
      }}
      mode={shareKeyId === item.id ? 'flat' : 'outlined'}>
      {item.name}
    </Chip>
  </View>
);

const switchTheKey = async (
  type,
  recid,
  oldKeyId,
  newKeyId,
  userData,
  refreshData,
) => {
  let data = {
    dataType: type,
    itemId: recid,
    oldKeyId: oldKeyId,
    newKeyId: newKeyId,
  };

  try {
    const res = await switchKey(userData.access_token, qs.stringify(data));
    console.log('Res Switch Key: ', res);
    refreshData();
  } catch (err) {
    console.log('Switch key error: ', err);
  }
};

export default SwitchKey;
