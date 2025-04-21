import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import axios from 'axios';

import InputText from '../input-text/input-text.component.js';
import InputTextIcon from '../input-text-icon/input-text-icon.component.js';
import Button from '../button/button.component';
import { BASE_URL, END_POINTS } from '../../configuration/api/api.types';
import Loader from '../loader/loader.component';

import styles from './create-an-account.style';

class CreateAnAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      isShowPassword: true,
      isShowPasswordError: false,
      isLoader: false,
    };
  }

  handleInputChange = (field, text) => {
    this.setState({
      [field]: field === 'firstname' || field === 'lastname'
        ? text.replace(/[^A-Za-z]/gi, '')
        : text,
    });
  };

  handleClick = async () => {
    const { firstname, lastname, email, password } = this.state;
    this.setState({ isLoader: true });

    try {
      if (!this.validation(firstname, lastname, email, password)) {
        this.setState({ isLoader: false });
        return;
      }

      if (!this.validatePassword(password)) {
        this.setState({ isLoader: false });
        return;
      }

      const data = qs.stringify({
        firstname,
        lastname,
        email,
        password,
      });

      const config = {
        method: 'post',
        url: `${BASE_URL}${END_POINTS.REGISTRATION_API}`,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data,
      };

      const response = await axios(config);
      console.log('Registration response:', response.data);

      this.setState({ isLoader: false });
      this.handleStatus(response.data);
    } catch (error) {
      console.error('Error in registration:', error);
      this.setState({ isLoader: false });
      Toast.show({
        text: 'Registration failed. Please try again.',
        position: 'bottom',
        type: 'danger',
        duration: 7000,
      });
    }
  };

  handleStatus = async ({ status, clientid }) => {
    switch (status) {
      case 'PasswordTooShort':
        Toast.show({
          text: 'Password too short',
          position: 'bottom',
          type: 'warning',
          duration: 7000,
        });
        break;
      case 'UserEmailExists':
        Toast.show({
          text: 'Email already exists',
          position: 'bottom',
          type: 'danger',
          duration: 7000,
        });
        break;
      case 'MFACodeRequired':
        Toast.show({
          text: 'You have successfully registered',
          position: 'bottom',
          type: 'success',
          duration: 7000,
        });
        await AsyncStorage.setItem('clientid', clientid);
        await AsyncStorage.setItem('email', this.state.email);
        this.props.navigation.navigate('AuthCode', { email: this.state.email });
        break;
      default:
        Toast.show({
          text: 'Unexpected response',
          position: 'bottom',
          type: 'danger',
          duration: 7000,
        });
        break;
    }
  };

  validation = (firstname, lastname, email, password) => {
    let message = '';
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!firstname || !lastname || !email || !password) {
      message = 'Please fill all the inputs';
    } else if (!emailRegex.test(email)) {
      message = 'Invalid email address';
    }

    if (message) {
      Toast.show({
        text: message,
        position: 'bottom',
        type: 'danger',
        duration: 7000,
      });
      return false;
    }

    return true;
  };

  validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;

    const isValid = passwordRegex.test(password);

    this.setState({ isShowPasswordError: !isValid });

    return isValid;
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isShowPassword: !prevState.isShowPassword,
    }));
  };

  render() {
    const {
      firstname,
      lastname,
      email,
      password,
      isShowPassword,
      isShowPasswordError,
      isLoader,
    } = this.state;

    return (
      <View>
        <View style={styles.inputContainer}>
          <InputText
            placeholder="First Name"
            onChange={(e) => this.handleInputChange('firstname', e.nativeEvent.text)}
            value={firstname}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputText
            placeholder="Last Name"
            onChange={(e) => this.handleInputChange('lastname', e.nativeEvent.text)}
            value={lastname}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputText
            placeholder="Email"
            onChange={(e) => this.handleInputChange('email', e.nativeEvent.text)}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputTextIcon
            placeholder="Password"
            icon={isShowPassword ? 'eye' : 'eye-slash'}
            onChange={(e) => this.handleInputChange('password', e.nativeEvent.text)}
            value={password}
            show={isShowPassword}
            onPress={this.togglePasswordVisibility}
          />
          {isShowPasswordError && (
            <View style={styles.extras}>
              <Text style={styles.extrasText}>
                Your password must be 8-16 characters and include at least one digit and one special character (!@#$%^&*).
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={this.handleClick} title="Create an account" />
        </View>

        <Loader isLoader={isLoader} />
      </View>
    );
  }
}

export default CreateAnAccount;
