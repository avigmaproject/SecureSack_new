import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  AppState,
  Image,
  ScrollView,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import qs from 'qs';
// import FingerprintScanner from 'react-native-fingerprint-scanner';
import {connect} from 'react-redux';

import {END_POINTS, BASE_URL} from '../../configuration/api/api.types';
import MainContent from '../../components/main-content/main-content.component';
import InputTextSearch from '../../components/input-text-search/input-text-search.component';
import Header from '../../components/header/header.component';
import HomeBody from '../../components/home-body/home-body.category.js';
import {userInfo} from '../../redux/user-info/actions/user-info.action';
import {countries} from '../../redux/countries-list/actions/countries-list.actions';
import {lookupType} from '../../configuration/api/api.functions';

import styles from './home.style';

class Home extends Component {
  _interval: any;
  constructor(props) {
    super(props);
    this.state = {
      isFingerPrintSettings: true,
      isSensorAvailable: false,
      enable_fingerprint: false,
      showPopup: true,
      access_token: '',
      info:null
    };
  }

  componentDidMount() {
    const {userData} = this.props;
    console.log("userdata",userData)
    const {navigation, route} = this.props;
    console.log('Route: ', route.params);
    this.getUserInfo();
    navigation.addListener('focus', () => {
      this.getUserInfo();
    });
    this.checkSession();
  }

  componentWillUnmount() {
    const {showPopup} = this.state;
    if (showPopup) {
      // FingerprintScanner.release();
    }
  }

  checkSession = async () => {
    try {
      let showPopup = await AsyncStorage.getItem('showPopup');
      console.log('Show Pop', showPopup);
      // this.setState({showPopup: JSON.parse(showPopup)}, () =>
      //   // this.detectFingerprintAvailable(),
      // );
    } catch (error) {
      console.log(error);
    }
  };

  getCountry = async () => {
    let information = await AsyncStorage.getItem('user_info');
    let info
    console.log('Check user info: ',information);
      if (information !== null) {
         info = JSON.parse(information);
        userInfo(info);
        this.setState({access_token: info.access_token}
        );
      }
    // const {country} = this.props.country;
    // const {access_token} = this.state;
    // if (country.length === 0) {
      await lookupType(info.access_token, 'RefCountry')
        .then((res) => this.filter(res))
        .catch((err) => console.log('Error in fetching country: ', err));
    // }
  };

  filter = (data) => {
    const {countries} = this.props;
    let arr = [];
    data.map((country) => arr.push(country.label));
    countries(arr);
    AsyncStorage.setItem('countries', JSON.stringify(arr))
  };

  getUserInfo = async () => {
    try {
      const information = await AsyncStorage.getItem('user_info');
      if (information !== null) {
        const info = JSON.parse(information);
        this.setState({ info, access_token: info.access_token });
        this.getCountry()
      }
    } catch (error) {
      console.log('Error in getting user info:', error);
    }
  };
  

  // detectFingerprintAvailable = () => {
  //   const {showPopup} = this.state;
  //   console.log('Show Pop', showPopup);
  //   if (showPopup || showPopup === null) {
  //     console.log('Done');
  //     FingerprintScanner.isSensorAvailable()
  //       .then((result) => {
  //         this.setState({isSensorAvailable: true});
  //       })
  //       .catch((error) => {
  //         this.setState({
  //           errorMessage: error.message,
  //           biometric: error.biometric,
  //         });
  //         console.log(error);
  //       });
  //   }
  // };

  checkLoginStatus = async () => {
    const {userData} = this.props;
    console.log("userdata",userData.userData.access_token)
    console.log('User data access token: ', userData.userData.access_token);
    var config = {
      method: 'get',
      url: `${BASE_URL}${END_POINTS.AUTH_STATUS}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + userData.userData.access_token,
      },
    };
    await axios(config)
      .then((res) => {
        console.log('Response in status checking: ', res.data);
        this.actionAsPerStatus(res.data);
      })
      .catch((error) => {
        console.log('Error in status checking: ', error);
      });
  };

  actionAsPerStatus = ({status, user}) => {
    const {navigation} = this.props;
    console.log('status: ', status);
    switch (status) {
      case 'notAuthenticated':
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        break;
    }
  };

  fingerprintOnLogin = async () => {
    const {enable_fingerprint} = this.state;
    const enablingFingerprint = [
      'enable_fingerprint',
      JSON.stringify(enable_fingerprint),
    ];
    const isShowPopup = ['showPopup', JSON.stringify(false)];
    try {
      await AsyncStorage.multiSet([enablingFingerprint, isShowPopup]);
      this.setState({isFingerPrintSettings: false});
    } catch (error) {
      console.log('Error in fingerpint modal');
    }
  };

  storePopupSession = async () => {
    try {
      await AsyncStorage.setItem('showPopup', JSON.stringify(false));
    } catch (error) {
      console.log(error);
    }
  };

  fingerPrintPopup = (isFingerPrintSettings, isSensorAvailable) => (
    <View style={{flex: 0}}>
      {isSensorAvailable && (
        <Modal
          transparent={true}
          animationType={'fade'}
          visible={isFingerPrintSettings}
          style={styles.modalStyle}>
          <View style={styles.modalBackground}>
            <View style={styles.fingerPrintModal}>
              <View style={styles.modelTextView}>
                <Text style={styles.modalText}>
                  Do you want to login with fingerprint?
                </Text>
              </View>
              <View style={styles.modalImageView}>
                <Image
                  source={require('../../assets/png-images/fingerprint.png')}
                  style={styles.imageStyle}
                />
              </View>
              <View style={styles.modalButtonView}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() =>
                    this.setState({enable_fingerprint: true}, () =>
                      this.fingerprintOnLogin(),
                    )
                  }>
                  <Text style={styles.modalButtonTitle}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() =>
                    this.setState(
                      {
                        isFingerPrintSettings: false,
                        enable_fingerprint: false,
                      },
                      () => this.storePopupSession(),
                    )
                  }>
                  <Text style={styles.modalButtonTitle}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );

  render() {
    const {isFingerPrintSettings, isSensorAvailable, access_token} = this.state;
    const {navigation, userData} = this.props;
    const { info } = this.state;
  const name = info?.fullname ?? '';

   
    console.log("info===",this.state.info?.fullname )
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.innerContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {this.fingerPrintPopup(isFingerPrintSettings, isSensorAvailable)}
          <Header navigation={navigation} />
          <View style={styles.grettingView}>
            <Text style={styles.grettingText}>
              Good Morning,<Text style={styles.name}> {name} </Text>
            </Text>
          </View>
          <HomeBody navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({userData, country}) => ({
  userData,
  country,
});

const mapDispatchToProps = (dispatch) => ({
  userInfo: (userData) => dispatch(userInfo(userData)),
  countries: (country) => dispatch(countries(country)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
