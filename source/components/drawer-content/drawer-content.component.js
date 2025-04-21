import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Title,
  Drawer,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {connect} from 'react-redux';
import {Toast} from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {END_POINTS, BASE_URL} from '../../configuration/api/api.types';
import {Color} from '../../assets/color/color';
import styles from './drawer-content.style';

const DrawerComponent = ({navigation, userData}) => {
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      if (!userData || !userData.userData) {
        const information = await AsyncStorage.getItem('user_info');
        console.log('Check user info: ', information);
        if (information) {
          const parsedInfo = JSON.parse(information);
          setLocalUser(parsedInfo);
        }
      }
    } catch (error) {
      console.log('Error in getting user info: ', error);
    }
  };

  const currentUser = userData?.userData || localUser;

  const name = currentUser?.fullname || 'name';
  const access_token = currentUser?.access_token || null;
  const avatar_text = name.charAt(0);
  const email = currentUser?.email || 'email';

  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.avatarView}>
              <Avatar.Text
                label={avatar_text}
                size={50}
                theme={{colors: {primary: Color.orange}}}
                color="#FFFFFF"
              />
              <View style={styles.userInfoView}>
                <Title style={styles.title}>{name}</Title>
              </View>
            </View>
          </View>
        </View>

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="key" color={color} size={size} />
            )}
            label="Key Ring"
            onPress={() => navigation.navigate('KeyRing')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="settings" color={color} size={size} />
            )}
            label="Settings"
            onPress={() => navigation.navigate('SettingsPage')}
          />
        </Drawer.Section>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <Drawer.Item
          icon={({color, size}) => (
            <MaterialIcons name="logout" color={color} size={size} />
          )}
          label="Log Out"
          onPress={() => {
            logout(navigation, access_token);
            navigation.closeDrawer();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

const logout = (navigation, access_token) =>
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {text: 'LOGOUT', onPress: () => signout(navigation, access_token)},
      {text: 'CANCEL'},
    ],
    {cancelable: false},
  );

const signout = async (navigation, access_token) => {
  if (access_token !== null) {
    const config = {
      method: 'post',
      url: `${BASE_URL}${END_POINTS.LOGOUT}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${access_token}`,
      },
    };
    console.log('Drawer', config);
    await axios(config)
      .then(() =>
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      )
      .catch((error) => {
        console.log('Logout: ', error.message);
        Toast.show({
          text: error.message,
          position: 'bottom',
          type: 'danger',
          duration: 7000,
        });
      });
  }
};

const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(DrawerComponent);
