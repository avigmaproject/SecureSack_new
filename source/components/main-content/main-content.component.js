import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';

import {mainContentList} from './main-content.list';
import Block from '../block/block.component';

const MainContent = ({navigation}) => {
  return (
    <FlatList
      data={mainContentList}
      renderItem={({item, index}) => (
        <Block item={item} navigation={navigation} index={index} />
      )}
      numColumns={2}
      // style={{flex: 0, flexDirection: 'column'}}
      // contentContainerStyle={{justifyContent: 'space-around'}}
      // columnWrapperStyle={{flexShrink: 1}}
    />
  );
};
export default MainContent;
