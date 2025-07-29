import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { View, FlatList } from 'react-native';
import { Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { switchKey } from '../../configuration/api/api.functions';

import styles from './switch-key.style';

const SwitchKey = ({ userData, type, recid, shareKeyId, refresh }) => {
  const [userInfo, setUserInfo] = useState(null);
console.log("shareKeyId", type, recid, shareKeyId, refresh)
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const information = await AsyncStorage.getItem('user_info');
        if (information) {
          const parsedInfo = JSON.parse(information);
          setUserInfo(parsedInfo);
          console.log('User Info loaded:', parsedInfo);
        }
      } catch (error) {
        console.log('Error loading user_info:', error);
      }
    };

    loadUserInfo();
  }, []);

  if (!userInfo?.shareKeys) {
    return null; // or a loading spinner
  }

  console.log('User Data Switch Key: ', userInfo);

  return (
    <View style={styles.container}>
      <FlatList
        data={userInfo.shareKeys}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) =>
          renderKey(item, type, recid, shareKeyId, index, userInfo, refresh)
        }
        horizontal
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
  userInfo,
  refreshData
) => {
  if (!item.name) return null;
console.log("sdsd",shareKeyId)
  const isSelected = shareKeyId === item.id; // ← DEFINE this here

  return (
    <View key={index} style={styles.key}>
    <Chip

  selectedIcon={null} // 👈 This removes the checkmark
  onPress={() =>
    switchTheKey(type, recid, shareKeyId, item.id, userInfo, refreshData)
  }
  mode={isSelected ? 'flat' : 'outlined'}
  style={{
    backgroundColor: isSelected ? '#FB9337' : "lightgrey",
  }}
  textStyle={{
    color: isSelected ? 'white' : 'black',
  }}
>
  {item.name}
</Chip>

    </View>
  );
};

const switchTheKey = async (
  type,
  recid,
  oldKeyId,
  newKeyId,
  userInfo,
  refreshData
) => {
  try {
    const data = qs.stringify({
      dataType: type,
      itemId: recid,
      oldKeyId: oldKeyId,
      newKeyId: newKeyId,
    });
  
    console.log(' data.type', type);
    console.log(' data.recid', recid);
    console.log(' data.oldKeyId',oldKeyId);
    console.log(' data.newKeyId',newKeyId);
    console.log("userInfo?.access_token",userInfo?.access_token)

    const response = await switchKey(userInfo?.access_token, data);
    console.log('Res Switch Key: ', response);
    refreshData();
  } catch (error) {
    console.log('Switch key error: ', error);
  }
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(SwitchKey);
