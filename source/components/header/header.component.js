import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import styles from './header.style';

const Header = ({navigation}) => (
  <View style={styles.headerView}>
    <TouchableOpacity
      style={styles.menu}
      onPress={() => navigation.toggleDrawer()}>
      <Icon name="menu" color="rgba(0,0,0,0.4)" size={24} />
    </TouchableOpacity>
    <Image style={styles.logo} source={require('../../assets/png-images/logo.png')}/>
  </View>
);
export default Header;
