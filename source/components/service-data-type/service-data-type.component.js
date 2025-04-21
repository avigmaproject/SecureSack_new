import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {Title, Caption, TouchableRipple} from 'react-native-paper';
import axios from 'axios';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {serviceDataTypeList, getDataAsType} from './service-data-type.list';
import {BASE_URL} from '../../configuration/api/api.types';

import styles from './service-data-type.style';

class ServiceDataType extends Component {
  initialState = {
    dataType: serviceDataTypeList,
    userInfo: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      this.loadUserInfo();
      this.getType();
      this.setState(this.initialState);
    });
  }

  loadUserInfo = async () => {
    const info = await AsyncStorage.getItem('user_info');
    if (info) {
      const parsed = JSON.parse(info);
      this.setState({userInfo: parsed});
    }
  };

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
          console.log('res: ', res.data.datatype.name);
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

  category = (item, index) => {
    const {title, category, type, icon, show} = item;
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
          data={category === undefined ? category : category.slice(0, show ? category.length : 3)}
          renderItem={({item}) => this.renderTitleSubtitle(item, type, title)}
          maxToRenderPerBatch={show ? category.length : 3}
        />
        {this.viewAll(category, index, show)}
      </View>
    );
  };

  viewAll = (category, index, show) => {
    if (category !== undefined && category.length > 3) {
      return this.viewAllComponent(index, show);
    }
  };

  viewAllComponent = (index, show) => {
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
      case 'ServiceAccount':
        return item.ServiceName;
      case 'RewardProgram':
        return item.NumberOfPoints;
      default:
        return '';
    }
  };

  getSubTitle = (type, item) => {
    switch (type) {
      case 'ServiceAccount':
        return item.AccountNumber;
      case 'RewardProgram':
        return item.Name;
      default:
        return '';
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

export default ServiceDataType;
