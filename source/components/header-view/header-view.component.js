import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Title} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from './header-view.style';

const HeaderView = ({navigation, theme, title}) => (
  <View style={styles.rowObject}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons
        name="arrow-back"
        color={theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)'}
        size={24}
      />
    </TouchableOpacity>
    <Title
      style={[
        styles.title,
        {
          color: theme !== 'dark' ? 'rgb(255, 255, 255)' : 'rgb(33, 47, 60)',
        },
      ]}>
      {title}
    </Title>
  </View>
);

export default HeaderView;
