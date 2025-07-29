import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Modal,
  ImageBackground,
  SafeAreaView,
  Alert,
  BackHandler,
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

import styles from './passport.style';

class Passport extends Component {
  initialState = {
    isLoader: false,
    editable: false,
    modal: '',
    array: [],
    access_token: '',
    name: '',
    countryofIssue: '',
    passportNo: '',
    dateOfIssue: '',
    expirationDate: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    countriesList:'',
    oldPassportNo1: '',
    placeOfIssue1: '',
    dateOfIssue1: '',
    expiredOn2: '',
    oldPassportNo2: '',
    placeOfIssue2: '',
    dateOfIssue2: '',
    expiredOn2: '',
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
    const {recid, mode} = route.params;
    BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      // if (this.props.userData && this.props.userData.userData)
        this.setState(
          {
            access_token: this.userInfo?.access_token,
          },
          () => this.viewRecord(),
          this.getUserInfo(),
          this.loadCountries()
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
  loadCountries = async () => {
    try {
      const saved = await AsyncStorage.getItem('countries');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.setState({ countriesList: parsed });
      }
    } catch (err) {
      console.error('Error loading countries:', err);
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
      'Passport',
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
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: true, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState({
      name: data.Name,
      countryofIssue: data.CountryOfIssue,
      passportNo: data.PassportNumber,
      dateOfIssue: data.DateOfIssue,
      expirationDate: data.ExpirationDate,
      address1: data.HomeAddressOnPassport.Line1,
      address2: data.HomeAddressOnPassport.Line2,
      city: data.HomeAddressOnPassport.City,
      state: data.HomeAddressOnPassport.State,
      zip: data.HomeAddressOnPassport.Zip,
      country: data.HomeAddressOnPassport.Country,
      oldPassportNo1: data.PreviousPassportNumber1,
      placeOfIssue1: data.PreviousPlaceOfIssue1,
      dateOfIssue1: data.PreviousDateOfIssue1,
      expiredOn2: data.PreviousExpirationDate1,
      oldPassportNo2: data.PreviousPassportNumber2,
      placeOfIssue2: data.PreviousPlaceOfIssue2,
      dateOfIssue2: data.PreviousDateOfIssue2,
      expiredOn2: data.PreviousExpirationDate2,
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
        console.log('User Info stored in variable:', this.userInfo);
      }
    this.setState({isLoader: true});
    const {
      name,
      countryofIssue,
      passportNo,
      dateOfIssue,
      expirationDate,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      oldPassportNo1,
      placeOfIssue1,
      dateOfIssue1,
      expiredOn1,
      oldPassportNo2,
      placeOfIssue2,
      dateOfIssue2,
      expiredOn2,
      access_token,
      notes,
    } = this.state;

    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      Name: name,
      CountryOfIssue: countryofIssue,
      PassportNumber: passportNo,
      DateOfIssue: dateOfIssue,
      ExpirationDate: expirationDate,
      'HomeAddressOnPassport-Line1': address1,
      'HomeAddressOnPassport-Line2': address2,
      'HomeAddressOnPassport-City': city,
      'HomeAddressOnPassport-State': state,
      'HomeAddressOnPassport-Zip': zip,
      'HomeAddressOnPassport-Country': country,
      PreviousPassportNumber1: oldPassportNo1,
      PreviousPlaceOfIssue1: placeOfIssue1,
      PreviousDateOfIssue1: dateOfIssue1,
      PreviousExpirationDate1: expiredOn2,
      PreviousPassportNumber2: oldPassportNo2,
      PreviousPlaceOfIssue2: placeOfIssue2,
      PreviousDateOfIssue2: dateOfIssue2,
      PreviousExpirationDate2: expiredOn2,
      Note: notes,
    });

    await createOrUpdateRecord('Passport', recid, data, this.userInfo?.access_token)
      .then((response) => {
        this.setState({isLoader: false});
        // navigation.goBack();
        this.props.navigation.navigate('GovernmentRecords');
      })
      .catch((error) => {
        this.setState({isLoader: false});
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
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
      'Passport',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token
    )
      .then((response) => this.props.navigation.navigate('GovernmentRecords'))
      .catch((error) => {
        console.log('Error in delete', error);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
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
      'Passport',
      recid,
      // this.props.userData.userData.access_token,
      this.userInfo?.access_token,
      data,
    )
      .then((response) => {
        this.setState({isLoader: false});
        console.log('Response', response);
        // navigation.goBack();
        this.props.navigation.navigate('GovernmentRecords');
      })
      .catch((error) => {
        this.setState({isLoader: false});
        console.log('Error in delete', error);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Login'}],
        // });
      });
  };

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) =>
            this.setState({name}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
           label={this.state.countryOfIssue || 'Country of Issue'}
           onPress={() =>
             this.setState(
               {
                 modal: true,
                 array: this.state.countriesList,
                 key: 'countryOfIssue',
               },
               () => this.changesMade(),
             )
           }
          
          color={Color.veryLightPink}
          editable={!this.state.editable}
          name="Country of Issue"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Passport Number"
          onChangeText={(passportNo) =>
            this.setState({passportNo}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.passportNo}
          editable={this.state.editable}
        />
        <View style={styles.clipboard}>
          <CopyClipboard
            text={this.state.passportNo}
            editable={this.state.editable}
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Date of Issue"
            onChangeText={(dateOfIssue) =>
              this.setState({dateOfIssue: formatDate(dateOfIssue)}, () =>
                this.changesMade(),
              )
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
              this.setState({expirationDate: formatDate(expirationDate)}, () =>
                this.changesMade(),
              )
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

  additionalInfo = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.address1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 2"
          onChangeText={(address2) =>
            this.setState({address2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.address2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="City"
          onChangeText={(city) =>
            this.setState({city}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.city}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="State"
          onChangeText={(state) =>
            this.setState({state}, () => this.changesMade())
          }
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
         label={this.state.country || 'Country'}
         onPress={() =>
           this.setState(
             {
               modal: true,
               array: this.state.countriesList,
               key: 'country',
             },
             () => this.changesMade(),
           )
         }
          color={Color.veryLightPink}
          editable={!this.state.editable}
          name="Country"
        />
      </View>
    </View>
  );

  previousPassports = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Old Passport Number 1"
          onChangeText={(oldPassportNo1) =>
            this.setState({oldPassportNo1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.oldPassportNo1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Place of Issue"
          onChangeText={(placeOfIssue1) =>
            this.setState({placeOfIssue1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.placeOfIssue1}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Date of Issue"
            onChangeText={(dateOfIssue1) =>
              this.setState({dateOfIssue1: formatDate(dateOfIssue1)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.dateOfIssue1}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="Expired On"
            onChangeText={(expiredOn1) =>
              this.setState({expiredOn1: formatDate(expiredOn1)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.expiredOn1}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Old Passport Number 2"
          onChangeText={(oldPassportNo2) =>
            this.setState({oldPassportNo2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.oldPassportNo2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Place of Issue"
          onChangeText={(placeOfIssue2) =>
            this.setState({placeOfIssue2}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.salmon}
          value={this.state.placeOfIssue2}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <InputTextDynamic
            placeholder="Date of Issue"
            onChangeText={(dateOfIssue2) =>
              this.setState({dateOfIssue2: formatDate(dateOfIssue2)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.dateOfIssue2}
            editable={this.state.editable}
            example="DD/MM/YYYY"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <InputTextDynamic
            placeholder="Expired On"
            onChangeText={(expiredOn2) =>
              this.setState({expiredOn2: formatDate(expiredOn2)}, () =>
                this.changesMade(),
              )
            }
            keyboardType="default"
            color={Color.salmon}
            value={this.state.expiredOn2}
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
        {this.state.editable ? (
          <MultilineInput
            placeholder="Notes"
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
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key, editable) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInfo()}
      <View style={styles.gap} />
      <Text style={styles.title}>Previous Passports</Text>
      {this.previousPassports()}
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
    this.setState({editable: false})
  };

  onEdit = () => {
    this.setState({editable: true}, () => console.log(this.state.editable));
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
    if (changes) {
      Alert.alert(
        //title
        'Save',
        //body
        'Do you want to save changes ?',
        [
          {text: 'Save', onPress: () => this.submit()},
          {text: 'Cancel', onPress: () =>    this.props.navigation.navigate('GovernmentRecords'), style: 'cancel'},
        ],
        {cancelable: false},
        //clicking out side of alert will not cancel
      );
    } else {
      // navigation.goBack();
      this.props.navigation.navigate('GovernmentRecords');
    }
    return true;
  };

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
              <SwitchKey type={'Passport'} recid={recid} shareKeyId={shareKeyId} refresh={this.refreshData}/>
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

export default connect(mapStateToProps)(Passport);
