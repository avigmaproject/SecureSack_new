import React, {Component} from 'react';
import {View, ScrollView, SafeAreaView, Modal, Alert} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {connect} from 'react-redux';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderView from '../../components/header-view/header-view.component';
import MyKeys from '../../components/my-keys/my-keys.component';
import KeysSharedWithMe from '../../components/keys-shared-with-me/keys-shared-with-me.component';
import {
  getKeys,
  getSharedKeys,
  createNewKey,
  importKey,
  unlinkKeys
} from '../../configuration/api/api.functions';
import InputTextDynamic from '../../components/input-text-dynamic/input-text-dynamic.component';
import Button from '../../components/button/button.component';
import {Color} from '../../assets/color/color';

import styles from './key-ring.style';

class KeyRing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myKeyList: [],
      sharedKeyList: [],
      addKeyModal: false,
      addKeyName: '',
      showImport: true,
      importKey: '',
      keyId: '',
    };
  }

  userInfo = null;
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      this.getUserInfo()
      this.getMyKeys();
      this.getSharedKeys();
     
    });
  }
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
  getMyKeys = async () => {
    try {
      const information = await AsyncStorage.getItem('user_info');
      if (information) {
        const parsedInfo = JSON.parse(information);
        this.userInfo = parsedInfo; // 👈 stored in class variable
        console.log('User Info stored in variable:', this.userInfo);
      }
      console.log("this.userInfo?.access_token",this.userInfo)
      // const { access_token } = this.props.userData.userData;
      const response = await getKeys(this.userInfo?.access_token); // or use access_token if that's correct
      console.log("ress", response);
      this.setState({ myKeyList: response });
    } catch (error) {
      console.log('Error in get key', error);
    }
  };
  

  getSharedKeys = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    await getSharedKeys(this.userInfo?.access_token)
      .then((response) => this.setState({sharedKeyList: response}))
      .catch((error) => console.log('shared key error: ', error));
  };

addTheKey = async () => {
  const { addKeyName } = this.state;
  console.log("here", addKeyName);

  // const { access_token } = this.props.userData.userData;

  if (addKeyName.length !== 0) {
    let data = qs.stringify({
      name: addKeyName,
    });
    console.log("data", data);

    try {
      const response = await createNewKey(this.userInfo?.access_token, data);
     Alert.alert("key created Succesfully!")
      this.setState({ addKeyName: '', addKeyModal: false }, () =>
        this.getMyKeys(),
      );
    } catch (error) {
      console.log("❌ Error in create key:", error);
      this.setState({ addKeyName: '', addKeyModal: false });
    }
  }
};

  
  importKeyCode = async () => {
    const {keyId, importKey} = this.state;
    let data = qs.stringify({
      keyId: keyId,
      code: importKey,
    });
    await importKey(this.props.userData.userData.access_token, data)
      .then((response) => {
        console.log('added: ', response);
        this.setState({importKey: '', addKeyModal: false}, () =>
          this.getSharedKeys(),
        );
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({importKey: '', addKeyModal: false});
      });
  };

  unlink = async (id) => {
    let data = qs.stringify({
      unlinkKeyId: id
    })
    await unlinkKeys(this.props.userData.userData.access_token, data)
      .then(response => {
        console.log("Unlink key res: ", response)
        this.getSharedKeys()
      })
      .catch(error => {
        console.log('Error: ', error);
      })
  }

  unlinkKey = (id) => {
    Alert.alert(
      //title
      'Unlink key',
      //body
      'Are you sure you want to unlink the key?',
      [
        {text: 'Yes', onPress: () => this.unlink(id)},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  modal = () => (
    <Modal
      visible={this.state.addKeyModal}
      transparent={true}
      animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalList}>
          {this.state.showImport ? this.import() : this.addKey()}
        </View>
      </View>
    </Modal>
  );

  addKey = () => (
    <>
    <InputTextDynamic
          placeholder="Key Name"
          onChangeText={(addKeyName) => {
          
            this.setState({ addKeyName });
          }}
          keyboardType="default"
          value={this.state.addKeyName}
          color={Color.orange}
          example="Ex. Family Key"
          editable={true}
        />
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <Button
            onPress={() => this.setState({addKeyModal: false})}
            title="Cancel"
            color="#DDDDDD"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <Button onPress={() => this.addTheKey()} title="Save" />
        </View>
      </View>
    </>
  );

  import = () => (
    <>
      <InputTextDynamic
        placeholder="Import Code"
        onChangeText={(importKey) => this.setState({importKey})}
        keyboardType="default"
        value={this.state.importKey}
        color={Color.orange}
      />
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <Button
            onPress={() => this.setState({addKeyModal: false})}
            title="Cancel"
            color="#DDDDDD"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <Button onPress={() => this.importKeyCode()} title="Save" />
        </View>
      </View>
    </>
  );

  render() {
    const {navigation} = this.props;
    const {myKeyList, sharedKeyList} = this.state;
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.outerView}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View>
              <View style={{marginLeft: 15}}>
                <HeaderView
                navigation={navigation}
                title="Key Ring"
                theme={'dark'}
              />
              </View>
              <View style={styles.outerView}>
                <MyKeys
                  keyList={myKeyList}
                  navigation={navigation}
                  onPress={() =>
                    this.setState({addKeyModal: true, showImport: false})
                  }
                />
              </View>
              <View style={styles.outerView}>
                <KeysSharedWithMe
                  list={sharedKeyList}
                  navigation={navigation}
                  onImport={(id) =>
                    this.setState({
                      addKeyModal: true,
                      showImport: true,
                      keyId: id,
                    })
                  }
                  onUnlink={(id) => this.unlinkKey(id)}
                />
              </View>
              {this.modal()}
            </View>
          </ScrollView>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = ({userData}) => ({
  userData,
});

export default connect(mapStateToProps)(KeyRing);
