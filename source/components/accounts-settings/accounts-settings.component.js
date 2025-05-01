import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Toast, NativeBaseProvider} from 'native-base';
import qs from 'qs';
import {connect} from 'react-redux';

import Loader from '../../components/loader/loader.component';
import InputTextDynamic from '../../components/input-text-dynamic/input-text-dynamic.component';
import HeaderView from '../../components/header-view/header-view.component';
import Button from '../button/button.component';
import {Color} from '../../assets/color/color.js';
import {
  changePassword,
  resetPasswordStepOne,
} from '../../configuration/api/api.functions';

import styles from './accounts-settings.style';

class AccountSettings extends Component {
  initialState = {
    oldPass: '',
    newPass: '',
    conPass: '',
    isLoader: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
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
  changePass = async () => {
    this.getUserInfo()
Keyboard.dismiss()
    this.setState({isLoader: true});
    const {oldPass, newPass, conPass} = this.state;

    const access_token = this.userInfo?.access_token;
    console.log("chngepass",access_token)
    const {navigation} = this.props
    if (this.validation(oldPass, newPass, conPass)){
      if (this.passwordMatch(newPass, conPass)){
        if (this.passwordValidation(conPass)){
          const data = qs.stringify({
      oldPassword: oldPass,
      password: newPass,
      password2: conPass,
    });
    console.log("  await changePassword(access_token, data)",  await changePassword(access_token, data))
    await changePassword(access_token, data)
      .then((response) => {
        console.log('Ref Password: ', response);
        alert(response.message)
        if(response.status==="Success"){
          this.showToast('Password reset successfully', 'success');
          navigation.goBack()
        }
        // this.showToast('Password reset successfully', 'success');
      
        this.setState({isLoader: false});
      
      })
      .catch((error) => {
        console.log('Error: ', error);
         this.setState({isLoader: false});
        // navigation.reset({
        //     index: 0,
        //     routes: [{name: 'Login'}],
        //   }),
        alert(error);
      });
        }
      }
    }
  };

  passwordValidation = (password) => {
    let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    let cancel = false;
    if (reg.test(password) === false) {
      cancel = true;
    }
    if (cancel) {
      this.showToast("Password should contain alphanumeric and special character", 'danger')
      return false;
    } else {
      return true;
    }
  }

  passwordMatch = (newPass, conPass) => {
    if (newPass === conPass){
      return true;
    }
    this.showToast("Password doesn't match", 'danger')
    return false;
  }

  validation = (oldPass, newPass, conPass) => {
    let cancel = false;
    let message = '';
    if (oldPass.length == 0) {
        cancel = true;
        message = 'Please fill all the inputs';
      }
      if (newPass.length == 0) {
        cancel = true;
        message = 'Please fill all the inputs';
      }
      if (conPass.length == 0) {
        cancel = true;
        message = 'Please fill all the inputs';
      }
      if (cancel) {
      Toast.show({
        text: message,
        buttonText: 'DISMISS',
        type: 'danger',
        position: 'bottom',
        duration: 10000,
      });
    } else {
      return true;
    }
    return false;
    }

  dataEncryption = async () => {
    const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
        console.log('User Info stored in variable:', this.userInfo);
      }
    const email = await AsyncStorage.getItem('email');
    const {navigation} = this.props
    console.log(this.userInfo?.access_token, 'async');
    var data = qs.stringify({email: email});
    await resetPasswordStepOne(email,this.userInfo?.access_token)
      .then((response) => {
        console.log('Ref Business: ', response);
        alert('Data encryption key sent successfully')
        this.showToast('Data encryption key sent', 'success');
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error: ', error.message);
        this.setState({isLoader: false});
        // navigation.reset({
        //     index: 0,
        //     routes: [{name: 'Login'}],
        //   })
      });
  };

  showToast = (message, type) => {
    Toast.show({
      text: message,
      buttonText: 'DISMISS',
      type: type,
      position: 'bottom',
      duration: 3000,
      textStyle: styles.toastText,
    });
  };

  title = (title) => (
    <View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  changePasswordView = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Password"
          onChangeText={(oldPass) => this.setState({oldPass})}
          keyboardType="default"
          color={Color.orange}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="New Password"
          onChangeText={(newPass) => this.setState({newPass})}
          keyboardType="default"
          color={Color.orange}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Confirm Password"
          onChangeText={(conPass) => this.setState({conPass})}
          keyboardType="default"
          color={Color.orange}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => this.changePass()} title="Change Password" />
      </View>
    </View>
  );

  dataEncryptionKeyView = () => (
    <View>
      <Text style={styles.note}>
        To reset your password in the future you will need your personalized 16
        digit data encryption key first sent to you by SecureSack. If you have
        misplaced it SecureSack highly recommends you get a copy sent to your
        email now so that you can reset your password in the future.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => this.dataEncryption()}
          title="Email my Data Encryption Key"
        />
      </View>
    </View>
  );

  render() {
    const {navigation} = this.props;
    return (
      <NativeBaseProvider>
        <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <HeaderView
            navigation={navigation}
            title="Account Settings"
            theme={'dark'}
          />
          <View style={styles.outerView}>
            {this.title('Change Password')}
            {this.changePasswordView()}
          </View>
          <View style={styles.outerView}>
            {this.title('Data Encryption Key')}
            {this.dataEncryptionKeyView()}
          </View>
        </View>
      </ScrollView>
      </NativeBaseProvider>
    );
  }
}
const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(AccountSettings);
