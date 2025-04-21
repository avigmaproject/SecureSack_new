import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

import styles from './header-button.style';

const HeaderButton = ({icon, title, navigation, iconPress}) => (
  <View style={styles.titleView}>
    <View style={styles.rowObject}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons name="arrow-back" color="rgb(33, 47, 60)" size={24} />
      </TouchableOpacity>
      <Title style={styles.title}>{title}</Title>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={iconPress}>
          <Icons
            name={icon}
            color={'rgb(33, 47, 60)'}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default HeaderButton;