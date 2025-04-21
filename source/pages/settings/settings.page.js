import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Text, TouchableRipple, Switch} from 'react-native-paper';
import HeaderView from '../../components/header-view/header-view.component';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import FingerprintScanner from 'react-native-fingerprint-scanner';

import styles from './settings.style';

class SettingsPage extends Component {
  constructor() {
    super();
    this.state = {
      isSensorAvailable: true,
      fingerSwitch: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      // this.fingerprintCheck();
    });
  }

  // fingerprintCheck = async () => {
  //   FingerprintScanner.isSensorAvailable()
  //     .then((result) => {
  //       this.setState({isSensorAvailable: false}, () => this.disablityCheck());
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  disablityCheck = async () => {
    try {
      let enablingFingerprint = await AsyncStorage.getItem(
        'enable_fingerprint',
      );
      if (enablingFingerprint !== null) {
        console.log('Enabling Fingerprint: ', enablingFingerprint);
        this.setState({fingerSwitch: JSON.parse(enablingFingerprint)}, () => console.log("Type check: ", typeof(this.state.fingerSwitch)));
      } else {
        console.log('Null ');
      }
    } catch (error) {
      console.log('Error in getting user info: ', error);
    }
  };

  title = (title) => (
    <View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  caption = (caption) => (
    <View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );

  captionView = (icon, title) => (
    <View style={styles.alignHor}>
      <MaterialIcons name={icon} size={24} color={'rgb(33, 47, 60)'} />
      {this.caption(title)}
    </View>
  );

  toggleSwitch = () => {
    this.setState({fingerSwitch: !this.state.fingerSwitch}, () =>
      this.setFingerprintValue(),
    );
  };

  setFingerprintValue = async () => {
    const {fingerSwitch} = this.state;
    try {
      await AsyncStorage.setItem('enable_fingerprint', JSON.stringify(fingerSwitch));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {navigation} = this.props;
    const {isSensorAvailable, fingerSwitch} = this.state;
    console.log('Sensor: ', isSensorAvailable);
    return (
      <View style={styles.container}>
        <HeaderView navigation={navigation} title="Settings" theme={'dark'} />
        <View style={styles.outerView}>
          {this.title('Biometrics')}
          <View style={styles.contentView}>
            {this.captionView('fingerprint', 'Biometrics Setting')}
            <Switch
              value={fingerSwitch}
              color={'#FB9337'}
              disabled={isSensorAvailable}
              onValueChange={() => this.toggleSwitch()}
            />
          </View>
        </View>
        <View style={styles.outerView}>
          {this.title('Account')}
          <TouchableRipple
            rippleColor="rgba(0, 0, 0, .32)"
            onPress={() => navigation.navigate('AccountSettings')}>
            <View style={styles.contentView}>
              {this.captionView('person', 'Profile Setting')}
            </View>
          </TouchableRipple>
        </View>
      </View>
    );
  }
}

export default SettingsPage;
