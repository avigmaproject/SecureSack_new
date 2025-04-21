import React, {Component} from 'react';
import {View, FlatList, Image, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Title, Caption, TouchableRipple} from 'react-native-paper';
import axios from 'axios';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {financialDataTypeList, getDataAsType} from './financial-data-type.list';
import {BASE_URL} from '../../configuration/api/api.types';

import styles from './financial-data-type.style';

class FinancialDataType extends Component {
  initialState = {
    dataType: financialDataTypeList,
    userInfo: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        this.setState(
          {
            userInfo: JSON.parse(userInfo),
            ...this.initialState,
          },
          () => {
            this.getType();
          },
        );
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.archive !== this.props.archive) {
      this.getType();
    }
  }

  getType = () => {
    getDataAsType.map((type) => this.getData(type));
  };

  getData = async (type) => {
    const {archive, navigation} = this.props;
    const {userInfo} = this.state;

    if (userInfo !== null) {
      let config = {
        method: 'GET',
        url: `${BASE_URL}/data/${type}`,
        params: {
          archive: archive,
          sortBy: 'lastAccessed',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + userInfo.access_token,
        },
      };

      await axios(config)
        .then((res) => {
          console.log('res: ', res.data);
          this.updateArray(res.data.data.items, res.data.datatype.name);
        })
        .catch((error) => {
          console.log('Bank account error: ', error);
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        });
    }
  };

  updateArray = (items, type) => {
    const {dataType} = this.state;
    dataType.map((value) => {
      if (value.type.includes(type)) {
        value.category = items;
      }
    });
    this.setState({dataType});
  };

  renderTitleSubtitle = (item, type, title) => {
    return (
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => this.navigation(type, title, item.id, 'View')}>
        <View>
          <View style={styles.titleSubTitle}>
            <Title style={styles.catTitle}>{this.getTitle(type, item)}</Title>
            <Caption>{this.getSubTitle(type, item)}</Caption>
            <View style={styles.arrowView}>
              <SimpleLineIcons name="arrow-right" color="rgb(33, 47, 60)" size={15} />
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  getTitle = (type, item) => {
    switch (type) {
      case 'BankAccounts':
        return item.AccountName;
      case 'CreditCard':
        return item.Name;
      case 'BrokerageAccount':
        return item.BrokerageName;
      case 'Mortgage':
      case 'ConsumerLoan':
        return item.Name;
    }
  };

  getSubTitle = (type, item) => {
    switch (type) {
      case 'BankAccounts':
        return item.AccountNumber;
      case 'CreditCard':
        return item.CardNumber;
      case 'BrokerageAccount':
        return item.AccountNumber;
      case 'Mortgage':
      case 'ConsumerLoan':
        return item.LoanNumber;
    }
  };

  category = (item, index) => {
    const {title, icon, category, type, show} = item;
    return (
      <View style={styles.container}>
        <View style={styles.titleIcon}>
          <Image source={icon} />
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            style={styles.addView}
            onPress={() => this.navigation(type, title, '__NEW__', 'Add')}>
            <Icon name="plus" color="rgb(33, 47, 60)" size={20} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={
            category === undefined
              ? category
              : category.slice(0, show ? category.length : 3)
          }
          renderItem={({item}) => this.renderTitleSubtitle(item, type, title)}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.viewAll(category, show, index)}
      </View>
    );
  };

  viewAll = (category, show, index) => {
    if (category !== undefined && category.length > 3) {
      return this.viewAllComponent(category, show, index);
    }
  };

  viewAllComponent = (category, show, index) => {
    return (
      <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" onPress={() => this.updateViewAll(index)}>
        <View style={styles.viewAll}>
          <Text style={styles.viewAllText}>{show ? 'Close' : 'View all'}</Text>
        </View>
      </TouchableRipple>
    );
  };

  updateViewAll = (index) => {
    const array = [...this.state.dataType];
    array[index].show = !array[index].show;
    this.setState({dataType: array});
  };

  navigation = (type, title, recid, mode) => {
    const {navigation} = this.props;
    const {userInfo} = this.state;

    if (userInfo?.showUpgrade && mode === 'Add') {
      Alert.alert(
        'Important',
        'You have reached your free record limit, please upgrade your service under the billing section on the SecureSack website',
        [{text: 'Ok', onPress: () => console.log('Cancelled')}],
        {cancelable: false},
      );
    } else {
      navigation.navigate(type, {
        type,
        title,
        recid,
        mode,
      });
    }
  };

  render() {
    const {dataType} = this.state;
    return (
      <View style={styles.view}>
        <FlatList
          data={dataType}
          renderItem={({item, index}) => this.category(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

export default FinancialDataType;
