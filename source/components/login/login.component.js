import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AppState, // We still import AppState
} from 'react-native';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
// import FingerprintScanner from 'react-native-fingerprint-scanner';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';

import InputText from '../input-text/input-text.component.js';
import InputTextIcon from '../input-text-icon/input-text-icon.component.js';
import Button from '../button/button.component';
import Loader from '../loader/loader.component';
import {END_POINTS, BASE_URL} from '../../configuration/api/api.types';
import {postApi, lookupType} from '../../configuration/api/api.functions';
import {userInfo} from '../../redux/user-info/actions/user-info.action';
import {countries} from '../../redux/countries-list/actions/countries-list.actions';

import styles from './login.style';

class LoginComponent extends Component {
  // We'll store the AppState subscription here so we can remove it later.
  appStateSubscription = null;

  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: true,
      username: '',
      password: '',
      message: '',
      navigation: props.navigation,
      isShowPasswordError: false,
      passwordMessage: '',
      errorMessage: undefined,
      biometric: undefined,
      popupShowed: false,
      isSensorAvailable: false,
      isPromptShow: false,
      clientid: '',
      access_token: '',
      isAcessTokenExpire: true,
      isLoader: false,
      enableFingerprint: false,
      appState: null, // Track the current app state if needed
    };
  }

  componentDidMount() {
    // Instead of using addEventListener('change', ...),
    // we store the subscription object so we can remove it properly later.
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );

    this.getAsyncItem();
  }

  componentWillUnmount() {
    // Remove the subscription properly using .remove()
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }

    // Release the fingerprint scanner if it's in use
    // FingerprintScanner.release();
  }

  // This replaces the old removeEventListener usage
  handleAppStateChange = (nextAppState) => {
    // If the app was inactive or backgrounded, and now is active:
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // Release any fingerprint usage and re-check sensor
      // FingerprintScanner.release();
      // this.detectFingerprintAvailable();
    }
    // Update the state
    this.setState({appState: nextAppState});
  };

  addFingerprintEvent = async () => {
    // this.detectFingerprintAvailable();
  };

  // detectFingerprintAvailable = () => {
  //   FingerprintScanner.isSensorAvailable()
  //     .then((result) => {
  //       this.setState(
  //         {isSensorAvailable: true, isPromptShow: true},
  //         () => this.startScannerProcess(),
  //         console.log('True'),
  //       );
  //     })
  //     .catch((error) => {
  //       this.setState({
  //         errorMessage: error.message,
  //         biometric: error.biometric,
  //       });
  //       console.log(error);
  //     });
  // };

  // startScannerProcess = async () => {
  //   console.log('Sen sor');
  //   const {navigation, isPromptShow, enableFingerprint} = this.state;
  //   if (isPromptShow && enableFingerprint) {
  //     FingerprintScanner.authenticate({
  //       description: 'Scan your fingerprint on the device scanner to continue',
  //     })
  //       .then(() => {
  //         console.log('Check: ', navigation);
  //         this.getStoredVal();
  //       })
  //       .catch((error) => console.log('Fingerprint scanner: ', error));
  //   }
  // };

  getStoredVal = async () => {
    try {
      let value = await AsyncStorage.multiGet([
        'email',
        'password',
        'clientid',
      ]);
      if (value !== null) {
        let email = value[0][1];
        let password = JSON.parse(value[1][1]);
        let clientid = JSON.parse(value[2][1]);
        this.setState(
          {username: email, password: password, clientid: clientid},
          () => this.handleClick(),
        );
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  };

  checkAccessToken = async () => {
    this.setState({isLoader: true});
    const {access_token} = this.state;
    console.log('Acess token api: ', access_token);
    if (
      access_token !== null &&
      access_token !== undefined &&
      access_token.length > 0
    ) {
      var config = {
        method: 'get',
        url: `${BASE_URL}${END_POINTS.AUTH_STATUS}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + access_token,
        },
      };
      await axios(config)
        .then((res) => {
          console.log('Response in status checking: ', res.data);
          this.actionAsPerStatus(res.data);
          this.setState({isLoader: false});
        })
        .catch((error) => {
          console.log('Error in status checking: ', error);
          this.setState({isLoader: false});
        });
    }
  };

  actionAsPerStatus = ({status, message}) => {
    this.addFingerprintEvent();
  };

  getAsyncItem = async () => {
    try {
      let value = await AsyncStorage.multiGet([
        'clientid',
        'access_token',
        'enable_fingerprint',
        'email',
      ]);
      if (value !== null) {
        let clientid = value[0][1];
        let access_token = value[1][1];
        let enableFingerprint = JSON.parse(value[2][1]);
        let username = value[3][1];
        if (clientid !== null) {
          this.setState({clientid});
        }
        if (access_token !== null) {
          this.setState({access_token}, () => this.checkAccessToken());
        }
        if (enableFingerprint !== null) {
          this.setState({enableFingerprint});
        }
        if (username !== null) {
          this.setState({username});
        }
      }
    } catch (error) {
      console.log('Error in login component for async storage  values: ', error);
    }
  };

  handleClick = async () => {
    this.setState({isLoader: true});
    const {username, password, clientid} = this.state;
    console.log('Login api client id: ', clientid);
    if (this.validation(username, password)) {
      let data = qs.stringify({
        email: username,
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
      console.log('Login api config: ', config);
      await axios(config)
        .then((response) => {
          console.log('Response Login Api: ', JSON.stringify(response.data));
          this.status(response.data);
          this.setState({isLoader: false});
        })
        .catch((error) => {
          console.log('Error in Login api: ', error);
          Toast.show({
            text: error,
            type: 'danger',
            position: 'bottom',
            textStyle: styles.toastText,
            buttonText: 'DISMISS',
            duration: 7000,
          });
          this.setState({isLoader: false});
        });
    } else {
      this.setState({isLoader: false});
    }
  };

  saveClientId = async (clientid) => {
    try {
      await AsyncStorage.setItem('clientid', clientid);
    } catch (error) {
      console.log('Error while storing client id in login: ', error);
    }
  };

  saveEmail = async () => {
    const {username} = this.state;
    try {
      await AsyncStorage.setItem('email', username);
    } catch (error) {
      console.log('Error while storing email in login: ', error);
    }
  };

  status = (response) => {
    const {navigation, username, password} = this.state;
    const {status, message, clientid, access_token} = response;
    if (status === undefined) {
      this.showToast(message, 'danger', true);
    }
    switch (status) {
      case 'IncorrectPassword':
        this.showToast(message, 'warning', true);
        break;
      case 'UserUnconfirmedPasswordOk':
        this.showToast(message, 'warning', false);
        break;
      case 'UserNotFound':
        this.showToast(message, 'danger', true);
        this.setState({error: message});
        break;
      case 'DBSystemError':
        this.showToast(message, 'danger', true);
        break;
      case 'UserLockout':
        this.showToast(message, 'warning', false);
        break;
      case 'UserAlreadyLockedOut':
        this.showToast(message, 'danger', true);
        break;
      case 'Success':
        console.log("successs====>",response)
        this.saveSession(access_token, clientid, password);
        userInfo(response);
        this.saveUserInfo(response);
   
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        break;
      case 'MFACodeRequired':
        this.saveClientId(clientid);
        this.saveEmail();
        navigation.navigate('AuthCode', {
          email: username,
          clientid: clientid,
          password: password,
        });
        break;
      default:
        this.setState({error: message});
        break;
    }
  };

  saveUserInfo = async (data) => {
    console.log("dataa===>",data)
    try {
      console.log('Check user info auth: ');
      await AsyncStorage.setItem('user_info', JSON.stringify(data));
    } catch (error) {
      console.log('Error in user info: ', error);
    }
  };

  saveSession = async (access_token, clientid, password) => {
    this.country(access_token);
    try {
      const token = ['access_token', JSON.stringify(access_token)];
      const id = ['clientid', JSON.stringify(clientid)];
      const pass = ['password', JSON.stringify(password)];
      await AsyncStorage.multiSet([token, id, pass]);
    } catch (error) {
      console.log('Error in access token: ', error);
    }
  };

  country = async (access_token) => {
    await lookupType(access_token, 'RefCountry')
      .then((res) => this.filter(res))
      .catch((err) => console.log('Error in fetching country: ', err));
  };

  showToast = (message, type, isButtonText) => {
    Toast.show({
      text: message,
      type: `${type}`,
      position: 'bottom',
      textStyle: styles.toastText,
      buttonText: isButtonText ? 'DISMISS' : 'OK',
      duration: 7000,
    });
  };

  validation = (username, password) => {
    console.log('Validation function called');
    let cancel = false;
    let message = '';
    console.log('Validation false 1', username.length);
    if (username.length == 0 && password.length == 0) {
      cancel = true;
      message = 'Fields can not be empty';
      console.log('Validation false 2', username.length);
    } else if (username.length == 0 || password.length == 0) {
      console.log('Validation false 1', username.length);
      if (username.length == 0) {
        cancel = true;
        message = 'Please enter username';
      }
      if (password.length == 0) {
        cancel = true;
        message = 'Please enter password';
      }
    }

    if (cancel) {
      Toast.show({
        text: message,
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

  handleTogglePassword = () => {
    console.log('Toggle Password');
    const {isShowPassword} = this.state;
    this.setState({isShowPassword: !isShowPassword});
  };

  handleLoginText = ({nativeEvent: {text}}) => {
    console.log('login: ', text);
    this.setState({username: text});
  };

  handlePasswordText = ({nativeEvent: {text}}) => {
    console.log('password: ', text);
    this.setState({password: text});
  };

  render() {
    const {
      isShowPassword,
      username,
      password,
      isLoader,
      error,
    } = this.state;
    const {navigation} = this.props;

    return (
      <View>
        <View style={styles.inputContainer}>
          <InputText
            placeholder="Email"
            onChange={this.handleLoginText}
            value={username}
            keyboardType="email-address"
          />
        </View>
        <Text style={styles.extrasText}> {error} </Text>
        <View style={styles.inputContainer}>
          <InputTextIcon
            placeholder="Password"
            icon={isShowPassword ? 'eye' : 'eye-slash'}
            onChange={this.handlePasswordText}
            value={password}
            show={isShowPassword}
            onPress={this.handleTogglePassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleClick} title="Login" />
        </View>
        <View style={styles.extras}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.extrasText}> Forgot Password? </Text>
          </TouchableOpacity>
        </View>
        <Loader isLoader={isLoader} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  userInfo: (userData) => dispatch(userInfo(userData)),
  countries: (country) => dispatch(countries(country)),
});

export default connect(null, mapDispatchToProps)(LoginComponent);
