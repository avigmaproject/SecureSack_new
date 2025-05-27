import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {Chip} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';

import {switchKey} from '../../configuration/api/api.functions';
import styles from './switch-key.style';

const SwitchKey = ({type, recid, shareKeyId, refresh}) => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const info = await AsyncStorage.getItem('user_info');
      if (info) {
        const parsed = JSON.parse(info);
        setUserData(parsed);
      }
    } catch (err) {
      console.log('Error reading user info:', err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  const switchTheKey = async (
    type,
    recid,
    oldKeyId,
    newKeyId,
    refreshData,
  ) => {
    try {
      const info = await AsyncStorage.getItem('user_info');
      const userData = JSON.parse(info);
  
      if (!userData?.access_token) {
        console.log('Access token not found');
        return;
      }
  
      const data = qs.stringify({
        dataType: type,
        itemId: recid,
        oldKeyId: oldKeyId,
        newKeyId: newKeyId,
      });
  
      console.log('Switching with token:', userData.access_token, type);
  
      const response = await switchKey(userData.access_token, data);
      console.log('Res Switch Key: ', response);
  
      refreshData?.(); // optional chaining
    } catch (error) {
      console.log('Switch key error: ', error);
    }
  };

  const renderKey = (
    item,
    type,
    recid,
    shareKeyId,
    index,
    userData,
    refreshData,
  )=> {
    if (!item.name) return null; // Skip blank-name items
  
    return (
      <View key={index} style={styles.key}>
         <Chip
        onPress={() => {
          if (typeof refreshData === 'function') {
            refreshData();  // Call the refresh function
          } else {
            console.log('refreshData is not a function');
          }
        }}
        mode={shareKeyId === item.id ? 'flat' : 'outlined'}>
        {item.name}
      </Chip>
      </View>
  );
  };

  // ✅ Don't render until userData is loaded
  if (!userData || !userData.shareKeys) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={userData.shareKeys}
        renderItem={({item, index}) =>
          renderKey(item, type, recid, shareKeyId, index, userData, refresh)
        }
        horizontal
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      />
    </View>
  );
};

export default SwitchKey;
