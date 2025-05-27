import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Modal,
  ImageBackground,
  SafeAreaView,
  Alert,
  BackHandler
} from 'react-native';
import {Text} from 'react-native-paper';
import qs from 'qs';
import {connect} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component.js';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component.js';
import ModalPicker from '../../../components/modal-picker/modal-picker.component.js';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import TitleView from '../../../components/title-view/title-view.component';
import ModalScreen from '../../../components/modal/modal.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
} from '../../../configuration/api/api.functions';
import {Color} from '../../../assets/color/color.js';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import CopyClipboard from '../../../components/copy-clipboard/copy-clipboard.component';

import styles from './identity.style';

class IdentificationCards extends Component {
  initialState = {
    isLoader: false,
    editable: true,
    modal: '',
    array: [],
    access_token: '',
    name: '',
    idNo: '',
    issuer: '',
    dateOfIssue: '',
    expirationDate: '',
    placeOfIssue: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    notes: '',
    changes: false,
    shareKeyId: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
    };
  }
  userInfo = null;
  componentDidMount() {
    const {navigation, route} = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      // if (this.props.userData && this.props.userData.userData)
      // if(this.userInfo)
        this.setState(
          {
            // access_token: this.props.userData.userData.access_token,
            access_token: this.userInfo?.access_token
          },
          () => this.viewRecord(),
          this.getUserInfo()
        );
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
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
  viewRecord = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'IdentificationCards',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token
    )
      .then((response) => {
        console.log('View res: ', response);
        this.setViewData(response.data);
        this.setState({isLoader: false});
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: true, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    this.setState({
      name: data.IDName,
      idNo: data.IDNumber,
      issuer: data.Issuer,
      dateOfIssue: data.DateOfIssue,
      expirationDate: data.ExpirationDate,
      placeOfIssue: data.PlaceOfIssue,
      address1: data.AddressGiven.Line1,
      address2: data.AddressGiven.Line2,
      city: data.AddressGiven.City,
      state: data.AddressGiven.State,
      zip: data.AddressGiven.Zip,
      country: data.AddressGiven.Country,
      notes: data.Note,
      shareKeyId: data.shareKeyId,
      isLoader: false,
    });
  };

  submit = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
  
    }
    this.setState({isLoader: true});
    const {
      name,
      idNo,
      issuer,
      dateOfIssue,
      expirationDate,
      placeOfIssue,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      access_token,
      notes
    } = this.state;

    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      IDName: name,
      IDNumber: idNo,
      Issuer: issuer,
      DateOfIssue: dateOfIssue,
      ExpirationDate: expirationDate,
      PlaceOfIssue: placeOfIssue,
      'AddressGiven-Line1': address1,
      'AddressGiven-Line2': address2,
      'AddressGiven-City': city,
      'AddressGiven-State': state,
      'AddressGiven-Zip': zip,
      'AddressGiven-Country': country,
      Note: notes
    });

    await createOrUpdateRecord('IdentificationCards', recid, data, this.userInfo?.access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
  };

  delete = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'IdentificationCards',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token
    )
      .then((response) => navigation.goBack())
      .catch((error) => {
        console.log('Error in delete', error)
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
  };

  archive = async () => {
    const information = await AsyncStorage.getItem('user_info');
    if (information) {
      const parsedInfo = JSON.parse(information);
      this.userInfo = parsedInfo; // 👈 stored in class variable
      console.log('User Info stored in variable:', this.userInfo);
    }
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'IdentificationCards',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token,
      data,
    )
      .then((response) => {
        this.setState({isLoader: false});
        console.log('Response', response);
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
        console.log('Error in delete', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        })
      });
  };

  additionalInfo = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Place of Issue"
          onChangeText={(placeOfIssue) => this.setState({placeOfIssue}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.placeOfIssue}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) => this.setState({address1}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.address1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 2"
          onChangeText={(address2) => this.setState({address2}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.address2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="City"
          onChangeText={(city) => this.setState({city}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.city}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="State"
          onChangeText={(state) => this.setState({state}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.state}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.zip}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.country.length === 0 ? 'Country' : this.state.country
          }
          onPress={() =>
            this.setState({
              modal: true,
              array: this.props.country.country,
              key: 'country',
            }, () => this.changesMade())
          }
          color={Color.veryLightPink}
          editable={this.state.editable}
          name="Country"
        />
      </View>
    </View>
  );

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) => this.setState({name}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="ID Number"
          onChangeText={(idNo) => this.setState({idNo}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.idNo}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.idNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Issuer"
          onChangeText={(issuer) => this.setState({issuer}, () => this.changesMade())}
          keyboardType="default"
          color={Color.salmon}
          value={this.state.issuer}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Date of Issue"
            onChangeText={(dateOfIssue) =>
              this.setState({dateOfIssue: formatDate(dateOfIssue)}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.dateOfIssue}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="Expiration Date"
            onChangeText={(expirationDate) =>
              this.setState({expirationDate: formatDate(expirationDate)}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.expirationDate}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
      </View>
    </View>
  );

  notes = () => (
    <View>
      <View style={styles.inputContainer}>
        {!this.state.editable ? (
          <MultilineInput
            placeholder="Note"
            onChangeText={(notes) =>
              this.setState({notes}, () => this.changesMade())
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.notes}
          />
        ) : (
          <Text style={styles.notes}>{this.state.notes}</Text>
        )}
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.notes}
            editable={this.state.editable}
          />
        </View>
      </View>
    </View>
  );

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

changesMade = () => {
  const {mode} = this.props.route.params;
  const {editable} = this.state;
  if (!editable) this.setState({ changes: true }, () => console.log("Check: "));
}

  editComponent = (isLoader, modal, array, key, editable) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInfo()}
      <View style={styles.gap} />
      <Text style={styles.title}>Notes</Text>
      {this.notes()}
      <Loader isLoader={isLoader} />
      <ModalScreen
        isModalVisible={modal}
        list={array}
        changeModalVisibility={this.changeModalVisibility}
        id={key}
        changeState={this.changeState}
      />
    </View>
  );

  onSave = () => {
    this.submit();
  };

  onEdit = () => {
    this.setState({editable: false}, () => console.log(this.state.editable));
  };

  onDelete = () => {
    Alert.alert(
      //title
      'Delete',
      //body
      'Are you sure you want to delete ?',
      [
        {text: 'Yes', onPress: () => this.delete()},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  onArchive = () => {
    this.archive();
  };

  onBack = () => {
    const {navigation} = this.props;
    const {changes} = this.state;
    if (changes){
      Alert.alert(
      //title
      'Save',
      //body
      'Do you want to save changes ?',
      [
        {text: 'Save', onPress: () => this.submit()},
        {text: 'Cancel', onPress: () => navigation.goBack(), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
    }else {
      navigation.goBack();
    }
    return true
  }

  background = () =>
    require('../../../assets/jpg-images/Government-Record-Background/government-records-background.jpg');

  render() {
    const {isLoader, modal, array, key, editable, shareKeyId} = this.state;
    const {route, navigation} = this.props;
    const {title, type, mode, recid} = route.params;
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.outerView}>
          <ImageBackground
            source={this.background()}
            style={styles.backgroundImage}>
            <View style={styles.titleView}>
              <TitleView
                navigation={navigation}
                mode={mode}
                theme={'light'}
                title={title}
                type={type}
                save={this.onSave}
                edit={this.onEdit}
                delete={this.onDelete}
                archive={this.onArchive}
                backpress={this.onBack}
                editable={editable}
              />
            </View>
            <ScrollView
              ref={(ref) => (this.scroll = ref)}
              onContentSizeChange={() => {
                this.scroll.scrollTo({y: 0});
              }}
              style={styles.outerContainerView}
              keyboardShouldPersistTaps="handled">
              <View style={styles.container}>
                {this.editComponent(isLoader, modal, array, key, editable)}
              </View>
              <SwitchKey type={'IdentificationCards'} recid={recid} shareKeyId={shareKeyId} refresh={this.refreshData}/>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = ({userData, country}) => ({
  userData,
  country,
});

export default connect(mapStateToProps)(IdentificationCards);
