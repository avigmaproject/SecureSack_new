import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Toast} from 'native-base';
import { NativeBaseProvider } from 'native-base';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


import LoginComponent from '../../components/login/login.component';
import CreateAnAccount from '../../components/create-an-account/create-an-account.component';

import styles from './login-registration.style';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActiveLoginSwitcher: true,
      isLogin: 'false',
    };
  }

  componentDidMount() {
    this.checkingLoginStatus();
  }

  checkingLoginStatus = () => {
    const {navigation} = this.props;
    const {isLogin} = this.state;
    if (isLogin === 'true') {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  };

  getLoginSession = () => {
    try {
      const isLogin = AsyncStorage.getItem('isLogin');
      if (isLogin !== null) {
        console.log('Login: ', isLogin);
        this.setState({isLogin});
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {isActiveLoginSwitcher} = this.state;
    const {navigation} = this.props;
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
            <ScrollView keyboardShouldPersistTaps="handled">
              <View>
                <View>
                  <ImageBackground
                    source={require('../../assets/png-images/semi-cricle.png')}
                    style={styles.circle}>
                    <Text style={styles.logo}>
                      SECURE
                      <Text style={styles.logoSecure}>SACK</Text>
                    </Text>
                  </ImageBackground>
                </View>
                <View style={styles.middleContainer}>
                  <View style={styles.switcher}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({isActiveLoginSwitcher: true})
                      }>
                      <Text
                        style={[
                          styles.switcherText,
                          {
                            color: isActiveLoginSwitcher
                              ? '#FFFFFF'
                              : 'rgba(255, 255, 255, 0.4)',
                          },
                        ]}>
                        Login
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({isActiveLoginSwitcher: false})
                      }>
                      <Text
                        style={[
                          styles.switcherText,
                          {
                            color: isActiveLoginSwitcher
                              ? 'rgba(255, 255, 255, 0.4)'
                              : '#FFFFFF',
                          },
                        ]}>
                        Create an account
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {isActiveLoginSwitcher ? (
                    <LoginComponent navigation={navigation} />
                  ) : (
                    <CreateAnAccount navigation={navigation} />
                  )}
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = ({isLogin}) => ({
  isLogin,
});

export default connect(mapStateToProps)(Login);
