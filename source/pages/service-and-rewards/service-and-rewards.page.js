import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Title} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

import ServiceDataType from '../../components/service-data-type/service-data-type.component.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './service-and-rewards.style';
import {BackHandler} from 'react-native';
class ServiceRewards extends Component {
  constructor() {
    super();
    this.state = {
      isArchive: false,
    };
  }
  userInfo = null;
  componentDidMount() {
    const { navigation } = this.props;
  
    // Add focus listener
    this.focusListener = navigation.addListener('focus', () => {
      // Add back handler when screen is focused
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress
      );
    });
  
    // Add blur listener to remove back handler
    this.blurListener = navigation.addListener('blur', () => {
      if (this.backHandler) this.backHandler.remove();
    });
  
    // Initial async load
    this.getUserInfo();
  }
  
  
  componentWillUnmount() {
    if (this.backHandler) this.backHandler.remove();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };
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

  render() {
    const {navigation} = this.props;
    const {isArchive} = this.state;
    return (
      <SafeAreaView style={styles.outerView}>
        <ImageBackground
          source={require('../../assets/jpg-images/Service-Reward-Background/service-and-reward-background.jpg')}
          style={styles.backgroundImage}>
          <View style={styles.titleView}>
            <View style={styles.rowObject}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="arrow-back" color="rgb(33, 47, 60)" size={24} />
              </TouchableOpacity>
              <Title style={styles.title}>Service and Rewards</Title>
              <View style={styles.icons}>
                <TouchableOpacity onPress={() => this.setState({isArchive: !isArchive})}>
                  <Icons name={isArchive ? "archive" : "unarchive"} color={"rgb(33, 47, 60)"} size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView style={styles.outerContainerView}>
            <ServiceDataType navigation={navigation} archive={isArchive}/>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

export default ServiceRewards;
