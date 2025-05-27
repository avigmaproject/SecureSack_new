import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainContent from '../main-content/main-content.component';
import InputTextSearch from '../input-text-search/input-text-search.component';
import SearchList from '../search-list/search-list.component.js';
import {search} from '../../configuration/api/api.functions';

import styles from './home-body.style';

class HomeBody extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      searchData: '',
    };
  }
  userInfo = null;
  getUserInfo = async () => {
    try {
      const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
        console.log('User Info stored in variable:', this.userInfo);
      }
    } catch (error) {
      console.log('Error fetching user info:', error);
    }
  };
  handleSearch = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({search: text});
    this.searchTitle(text);
  };

  searchTitle = async (text) => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    // const {access_token} = this.userInfo;
    console.log('Access: ', this.userInfo?.access_token);
    await search(this.userInfo?.access_token, text)
      .then((response) => {
        console.log('Search Res: ', response);
        this.setState({searchData: response});
      })
      .catch((err) => console.log('Err: ', err));
  };

  render() {
    const {navigation} = this.props;
    const {search, searchData} = this.state;
    return (
      <>
        <View style={styles.searchView}>
          <InputTextSearch
            placeholder="Search"
            onChange={this.handleSearch}
            value={search}
            onClear={() => this.setState({search: ''})}
          />
        </View>
        {search.length === 0 ? (
          <MainContent navigation={navigation} />
        ) : (
          <SearchList searchData={searchData} navigation={navigation} />
        )}
      </>
    );
  }
}

const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(HomeBody);
