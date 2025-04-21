import React, {Component} from 'react';
import {View, Text, SafeAreaView, ImageBackground} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { Toast} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';

import qs from 'qs';
import axios from 'axios';
import {connect} from 'react-redux';

import InputTextIcon from '../../components/input-text-icon/input-text-icon.component';
import Button from '../../components/button/button.component';
import TextButton from '../../components/text-button/text-button.component';
import Loader from '../../components/loader/loader.component';

import {END_POINTS, BASE_URL} from '../../configuration/api/api.types';
import {postApi} from '../../configuration/api/api.functions';

import {userInfo} from '../../redux/user-info/actions/user-info.action';
import {countries} from '../../redux/countries-list/actions/countries-list.actions';
import {lookupType} from '../../configuration/api/api.functions';

import styles from './auth-code.style.js';

class AuthCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authcode: '',
      clientid: '',
      email: props.route.params.username,
      isLoader: false,
    };
  }

  componentDidMount() {
    this.getClientid();
    console.log('Checking props: ', this.props);
    // Toast.show({
    //   text: 'Please check your registered email id for the auth-code',
    //   type: 'success',
    //   position: 'bottom',
    //   textStyle: styles.toastText,
    //   buttonText: 'DISMISS',
    //   duration: 7000,
    // });
  }

  getClientid = async () => {
    try {
      let clientid = await AsyncStorage.getItem('clientid');
      let email = await AsyncStorage.getItem('email', email);
      if (clientid !== null) {
        console.log('User clientid: ', clientid);
        this.setState({clientid});
      }
      if (email !== null) {
        console.log('User emailk: ', email);
        this.setState({email});
      }
    } catch (error) {
      console.log('Error in getting clientid: ', error);
    }
  };

  handleAuthCode = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({authcode: text});
  };

  handleClick = async () => {
    const {authcode, clientid, email} = this.state;
    const {navigation, userInfo} = this.props;
    this.setState({isLoader: true});
    console.log(this.props);
    if (this.fieldVerification(authcode)) {
      var data = qs.stringify({
        authcode: authcode,
        clientid: clientid,
        email: email,
      });
      console.log({data});
      var config = {
        method: 'post',
        url: `${BASE_URL}${END_POINTS.CONFIRM_AUTH_CODE_API}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data,
      };

      console.log('Repsonse Email: ', data);
      await axios(config)
        .then((response) => {
          if (response.data !== null) {
            console.log('Repsonse: ', response);
            this.saveSession(
              response.data.access_token,
              response.data.clientid,
            );
            userInfo(response.data);
            this.saveUserInfo(response.data);
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
            this.setState({isLoader: false});
          }
        })
        .catch((error) => {
          if (error !== undefined) this.showMessage(error.response);
          console.log(error.response);
          this.setState({isLoader: false});
        });
    } else {
      this.setState({isLoader: true});
    }
  };

  saveUserInfo = async (data) => {
    try {
      console.log('Check user info auth: ');
      await AsyncStorage.setItem('user_info', JSON.stringify(data));
    } catch (error) {
      console.log('Error in user info: ', error);
    }
  };

  saveSession = async (access_token, clientid) => {
    this.country(access_token);
    try {
      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('clientid', clientid);
    } catch (error) {
      console.log('Error in access token: ', error);
    }
  };

  country = async (access_token) => {
    await lookupType(access_token, 'RefCountry')
      .then((res) => this.filter(res))
      .catch((err) => console.log('Error in fetching country: ', err));
  };

  filter = (data) => {
    const {countries} = this.props;
    let arr = [];
    data.map((country) => arr.push(country.label));
    countries(arr);
  };

  showMessage = ({status}) => {
    console.log('status: ', status);
    if (status !== undefined) {
      console.log('Working', typeof status);
      switch (status) {
        case 404:
          Toast.show({
            text: 'Invalid code. Make sure you have entered proper code',
            type: 'danger',
            position: 'bottom',
            textStyle: styles.toastText,
            buttonText: 'DISMISS',
            duration: 7000,
          });
          break;
      }
    }
  };

  fieldVerification = (authcode) => {
    if (authcode.length == 0) {
      Toast.show({
        text: 'Please enter OTP',
        buttonText: 'DISMISS',
        type: 'danger',
        position: 'bottom',
        duration: 7000,
        textStyle: styles.toastText,
      });
    } else {
      return true;
    }
    return false;
  };

  message = (message) => {
    Toast.show({
      text: message,
      buttonText: 'DISMISS',
      type: 'success',
      position: 'bottom',
      duration: 7000,
      textStyle: styles.toastText,
    });
  };

  resend = async () => {
    const {email, password, clientid} = this.props.route.params;
    this.setState({isLoader: true});
    let data = qs.stringify({
      email: email,
      password,
      clientid,
    });
    let config = {
      method: 'post',
      url: `${BASE_URL}${END_POINTS.LOGIN_API}`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      data,
    };
    console.log('Config: ', config);
    await axios(config)
      .then((response) => {
        this.setState({clientid: response.data.clientid});
        console.log('Response Login Api: ', JSON.stringify(response.data));
        this.message('Security code has been sent to your resgistered email');
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error in Login api: ', error.response.data.message);
        this.setState({isLoader: false});
      });
  };

  render() {
    const {authcode, isLoader} = this.state;
    return (
      <NativeBaseProvider>
        <View style={styles.background}>
          <ImageBackground
            source={require('../../assets/png-images/semi-cricle.png')}
            style={styles.circle}>
            <Text style={styles.logo}>
              SECURE
              <Text style={styles.logoSecure}>SACK</Text>
            </Text>
          </ImageBackground>
        </View>
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <InputTextIcon
              placeholder="Enter 6-digit code"
              onChange={this.handleAuthCode}
              value={authcode}
              keyboardType="number-pad"
              icon={'lock'}
              show={true}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.handleClick} title="Verify security code" />
          </View>
          <TextButton title="Resend" onPress={() => this.resend()} />
          <Loader isLoader={isLoader} />
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userInfo: (userData) => dispatch(userInfo(userData)),
  countries: (country) => dispatch(countries(country)),
});
export default connect(null, mapDispatchToProps)(AuthCode);
