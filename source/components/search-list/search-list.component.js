import React from 'react';
import {View, FlatList, Image} from 'react-native';
import {Text, TouchableRipple, Card} from 'react-native-paper';

import styles from './search-list.style';

const SearchList = ({searchData, navigation}) => (
  <View style={styles.container}>
    {searchData.length !== 0 ? (
      <FlatList
        data={searchData}
        renderItem={({item}) => searchView(item, navigation)}
      />
    ) : (
      <View>{noSearchResult()}</View>
    )}
  </View>
);

const noSearchResult = () => (
  <View style={styles.noSearchView}>
    <Image source={require('../../assets/png-images/No-Data/noData.png')}/>
    <Text style={styles.title}>No Result Found</Text>
  </View>
);

const searchView = (item, navigate) => (
  <View style={styles.searchView}>
    <TouchableRipple
      rippleColor="rgba(0, 0, 0, .32)"
      onPress={() => navigation(item, navigate)}>
      <Card elevation={5} style={styles.cardView}>
        <Text style={styles.title}>{item.label}</Text>
      </Card>
    </TouchableRipple>
  </View>
);

navigation = (item, navigate) => {
  let urlArr = item.url.split('/');
  let viewArr = item.value.split('(');
  let title = viewArr[1].split(')');
  let type = urlArr[0];
  let recid = urlArr[1];

  navigate.navigate(type, {
    type: type,
    title: title,
    recid: recid,
    mode: 'View',
  });
};

export default SearchList;
