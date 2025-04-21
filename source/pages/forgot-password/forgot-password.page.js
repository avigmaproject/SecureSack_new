import React, {Component} from 'react';
import {View, Text, SafeAreaView, ImageBackground} from 'react-native';
import {Root, Toast} from 'native-base';
import qs from 'qs';
import axios from 'axios';

import InputText from '../../components/input-text/input-text.component.js';
import InputTextIcon from '../../components/input-text-icon/input-text-icon.component.js';
import Button from '../../components/button/button.component.js';
import {END_POINTS, BASE_URL} from '../../configuration/api/api.types';

import styles from './forgot-password.style';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmailComponent: true,
      isShowPassword: true,
      isShowConfirmPassword: true,
      email: '',
      emailKey: '',
      encryptionkey: '',
      password: '',
      confirmpassword: '',
      passwordMessage: '',
    };
  }

  handleEmail = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({email: text});
  };

  handleEmailKey = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({emailKey: text});
  };

  handleEncryptionKey = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({encryptionkey: text});
  };

  handlePassword = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({password: text});
  };

  handleConfirmPassword = ({nativeEvent: {eventCount, target, text}}) => {
    this.setState({confirmpassword: text});
  };

  handleClick = async () => {
    const {email} = this.state;
    if (this.verifyEmail(email)) {
      let data = qs.stringify({
        email,
      });
      let config = {
        method: 'post',
        url: `${BASE_URL}${END_POINTS.START_RESET_PASSWORD}`,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data,
      };

      await axios(config)
        .then((res) => {
          this.startResetPasswordStatus(res.data);
          console.log('Start Password: ', res.data);
        })
        .catch((error) => {
          console.log('Error in Login api: ', error.response);
          Toast.show({
            text: error.response.data.message,
            type: 'danger',
            position: 'bottom',
            textStyle: styles.toastText,
            buttonText: 'DISMISS',
            duration: 7000,
          });
        });
    }
  };

  startResetPasswordStatus = ({status}) => {
    const {navigation} = this.props;
    switch (status) {
      case 'Success':
        this.showToast(
          'Please check your submitted email id for the further process',
          'success',
          false,
        );
        this.setState({isEmailComponent: false});
        navigation.goBack();
        break;
      case 'emailSendError':
        this.showToast('Error in sending email', 'danger', true);
        break;
    }
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

  verifyEmail = (email) => {
    let cancel = false;
    let message = '';
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.length == 0) {
      cancel = true;
      message = 'Field can not be empty';
    }

    if (email.length > 0) {
      if (reg.test(email) === false) {
        cancel = true;
        message = 'Invalid email address';
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

  handleResetButton = async () => {
    const {emailKey, encryptionkey, password, confirmpassword} = this.state;
    if (
      this.verifyDoResetPassword(
        emailKey,
        encryptionkey,
        password,
        confirmpassword,
      )
    ) {
      if (this.verifyPassword(password, confirmpassword)) {
        let data = qs.stringify({
          emailKey,
          encryptionkey,
          newpassword: password,
          newpassword2: confirmpassword,
        });
        let config = {
          method: 'post',
          url: `${BASE_URL}${END_POINTS.DO_RESET_PASSWORD}`,
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
          data,
        };

        await axios(config)
          .then((res) => {
            console.log('Do Password: ', res.data);
            this.doResetPasswordStatus(res.data);
          })
          .catch((error) => {
            console.log('Error in Login api: ', error.response);
            Toast.show({
              text: error.response.data.message,
              type: 'danger',
              position: 'bottom',
              textStyle: styles.toastText,
              buttonText: 'DISMISS',
              duration: 7000,
            });
          });
      }
    }
  };

  doResetPasswordStatus = ({status, message}) => {
    
    switch (status) {
      case 'NewPasswordEncryptionError':
        this.showToast(message, 'danger', true);
        break;
      case 'EmailKeyMismatch':
        this.showToast(message, 'danger', true);
        break;
      case 'UserEmailNotFound':
        this.showToast(message, 'danger', true);
        break;
      case 'DBError':
        this.showToast(message, 'danger', true);
        break;
      case 'InvalidEncryptionKey':
        this.showToast(message, 'danger', true);
        break;
      case 'NewPasswordMismatch':
        this.showToast(message, 'danger', true);
        break;
      case 'UnknownEncryptionError':
        this.showToast(message, 'danger', true);
        break;
      case 'PasswordTooSimple':
        this.showToast(message, 'warning', false);
        break;
      case 'Success':
        this.showToast('Password successfully reset', 'success', false);
        break;
      default:
        break;
    }
  };

  verifyPassword = (password, confirmpassword) => {
    if (password === confirmpassword) {
      let cancel = false;
      let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
      if (reg.test(password) === false) {
        cancel = true;
      }
      if (cancel) {
        console.log('Password ', password);
        this.setState({
          passwordMessage:
            "Your password must be at least 8 characters to 16 characters and must contain one uppercase, one digit and special character '?!@#$%^&*'",
        });
      } else {
        this.setState({passwordMessage: ''});
        return true;
      }
      return false;
    } else {
      this.setState({
        passwordMessage: "Password and Confirm Password doesn't match",
      });
      return false;
    }
  };

  verifyDoResetPassword = (
    emailKey,
    encryptionkey,
    password,
    confirmpassword,
  ) => {
    let cancel = false;
    let message = '';
    if (
      emailKey.length == 0 &&
      encryptionkey.length == 0 &&
      password.length == 0 &&
      confirmpassword.length
    ) {
      cancel = true;
      message = 'Fields can not be empty';
    } else if (
      emailKey.length == 0 ||
      encryptionkey.length == 0 ||
      password.length == 0 ||
      confirmpassword.length
    ) {
      if (emailKey.length == 0) {
        cancel = true;
        message = 'Please enter Email Key';
      }
      if (encryptionkey.length == 0) {
        cancel = true;
        message = 'Please enter Encryption';
      }
      if (password.length == 0) {
        cancel = true;
        message = 'Please enter Password';
      }
      if (confirmpassword.length == 0) {
        cancel = true;
        message = 'Please enter Confirm Password';
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

  handleToggleConfirmPassword = () => {
    console.log('Toggle Password');
    const {isShowConfirmPassword} = this.state;
    this.setState({isShowConfirmPassword: !isShowConfirmPassword});
  };

  emailComponent = () => {
    const {email} = this.state;
    return (
      <View>
        <View style={styles.inputContainer}>
          <InputText
            placeholder="Email"
            onChange={this.handleEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleClick} title="Submit" />
        </View>
      </View>
    );
  };

  emailKeyPassComponent = () => {
    const {
      emailKey,
      encryptionkey,
      password,
      confirmpassword,
      isShowConfirmPassword,
      isShowPassword,
      passwordMessage,
    } = this.state;
    return (
      <View>
        <View style={styles.inputContainer}>
          <InputText
            placeholder="Re-enter email"
            onChange={this.handleEmailKey}
            value={emailKey}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <InputText
            placeholder="16-digit code"
            onChange={this.handleEncryptionKey}
            value={encryptionkey}
            keyboardType="default"
          />
        </View>
        <View style={styles.inputContainer}>
          <InputTextIcon
            placeholder="New Password"
            onChange={this.handlePassword}
            value={password}
            keyboardType="default"
            icon={isShowPassword ? 'eye' : 'eye-slash'}
            show={isShowPassword}
            onPress={this.handleTogglePassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputTextIcon
            placeholder="Confirm New Password"
            onChange={this.handleConfirmPassword}
            value={confirmpassword}
            keyboardType="default"
            icon={isShowConfirmPassword ? 'eye' : 'eye-slash'}
            show={isShowConfirmPassword}
            onPress={this.handleToggleConfirmPassword}
          />
          <View style={styles.extras}>
            <Text style={styles.extrasText}>{passwordMessage}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.handleResetButton} title="Reset Password" />
        </View>
      </View>
    );
  };

  render() {
    const {isEmailComponent} = this.state;
    return (
      <Root>
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
          {isEmailComponent ? (
            <View>{this.emailComponent()}</View>
          ) : (
            // <View>{this.emailKeyPassComponent()}</View>
            <View/>
          )}
        </SafeAreaView>
      </Root>
    );
  }
}

export default ForgotPassword;
