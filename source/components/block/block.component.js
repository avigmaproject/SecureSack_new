import React from 'react';
import {TouchableOpacity, ImageBackground, Text, Image} from 'react-native';

import styles from './block.style';

const Block = ({item, navigation, index}) => {
  console.log(index % 2);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigation)}
      style={[
        styles.container,
        index % 2 === 0 ? {marginRight: 7} : {marginLeft: 7},
      ]}>
      <ImageBackground
        source={item.background}
        imageStyle={styles.imageStyle}
        style={[styles.imageBackgroundStyle]}>
        <Image
          source={item.icon}
          style={[styles.icon, {width: 50, height: 50, resizeMode: 'contain'}]}
        />
        <Text style={[styles.title, {color: item.titleColor}]}>
          {item.title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default Block;
