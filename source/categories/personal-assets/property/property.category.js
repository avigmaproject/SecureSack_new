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

import InputTextDynamic from '../../../components/input-text-dynamic/input-text-dynamic.component';
import InputTextIconDynamic from '../../../components/input-text-icon-dynamic/input-text-icon-dynamic.component';
import ModalPicker from '../../../components/modal-picker/modal-picker.component';
import TitleView from '../../../components/title-view/title-view.component';
import Button from '../../../components/button/button.component';
import Loader from '../../../components/loader/loader.component';
import ModalScreen from '../../../components/modal/modal.component';
import MultilineInput from '../../../components/multiline-input-text/multiline-input-text.component';
import SwitchKey from '../../../components/switch-key/switch-key.component';
import {
  createOrUpdateRecord,
  viewRecords,
  deleteRecords,
  archiveRecords,
} from '../../../configuration/api/api.functions';
import {
  purpose,
  residence_type,
  construction_type,
  garage_type,
  sprinkler_type,
  alarm_type,
  boolean_value,
} from './property.list';
import {formatDate} from '../../../configuration/card-formatter/card-formatter';
import {Color} from '../../../assets/color/color';

import styles from './property.style';

class Property extends Component {
  initialState = {
    isLoader: false,
    editable: true,
    access_token: '',
    countries: '',
    modal: '',
    array: [],
    key: '',
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    boughtOn: '',
    houseSize: '',
    lotSize: '',
    county: '',
    schoolDistrict: '',
    apn: '',
    propertyTaxAmnt: '',
    yearOfConstruction: '',
    age: '',
    numberOfLevels: '',
    garageSize: '',
    respondingFireDepartment: '',
    distanceToFireDepartment: '',
    soldOn: '',
    purpose: '',
    residenceType: '',
    constructionType: '',
    garageType: '',
    sprinklerType: '',
    fireAlarmType: '',
    burgularAlarmType: '',
    smokeDetector: '',
    isFireHydrant: '',
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

  componentDidMount() {
    const {navigation, route} = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => this.onBack());
    navigation.addListener('focus', () => {
      this.setState(this.initialState);
      if (this.props.userData && this.props.userData.userData)
        this.setState(
          {
            access_token: this.props.userData.userData.access_token,
          },
          () => this.viewRecord(),
        );
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', handler);
  }

  viewRecord = async () => {
    const {navigation, route} = this.props;
    const {recid, mode} = route.params;
    this.setState({isLoader: true});
    await viewRecords(
      'Property',
      recid,
      this.props.userData.userData.access_token,
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
        });
      });
    this.setState({isLoader: false});
    if (mode === 'Add') this.setState({editable: false, hideResult: false});
  };

  refreshData = () => {
    this.viewRecord();
  };

  setViewData = (data) => {
    console.log('Data: ', data);
    this.setState({
      name: data.Name,
      address1: data.Address.Line1,
      address2: data.Address.Line2,
      city: data.Address.City,
      state: data.Address.State,
      zip: data.Address.Zip,
      country: data.Address.Country,
      boughtOn: data.StartDate,
      houseSize: data.HouseSize,
      lotSize: data.LotSize,
      county: data.County,
      schoolDistrict: data.SchoolDistrict,
      apn: data.APN,
      propertyTaxAmnt: data.PropertyTaxAmount,
      yearOfConstruction: data.YearOfConstruction,
      age: data.Age,
      numberOfLevels: data.NumberOfLevels,
      garageSize: data.GarageSize,
      respondingFireDepartment: data.RespondingFireDepartment,
      distanceToFireDepartment: data.DistanceToNearestFireDepartment,
      soldOn: data.EndDate,
      purpose: data.PropertyType,
      residenceType: data.ResidenceType,
      constructionType: data.ConstructionType,
      garageType: data.GarageType,
      sprinklerType: data.SprinklerType,
      fireAlarmType: data.FireAlarmType,
      burgularAlarmType: data.BurglarAlarmType,
      smokeDetector: data.HasSmokeDetectors ? 'Yes' : 'No',
      isFireHydrant: data.IsFireHydrantWithinThousandFeet ? 'Yes' : 'No',
      notes: data.Notes,
      shareKeyId: data.shareKeyId,
      isLoader: false,
    });
  };

  submit = async () => {
    this.setState({isLoader: true});
    const {
      access_token,
      name,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      boughtOn,
      houseSize,
      lotSize,
      county,
      schoolDistrict,
      apn,
      propertyTaxAmnt,
      yearOfConstruction,
      age,
      numberOfLevels,
      garageSize,
      respondingFireDepartment,
      distanceToFireDepartment,
      soldOn,
      purpose,
      residenceType,
      constructionType,
      garageType,
      sprinklerType,
      fireAlarmType,
      burgularAlarmType,
      smokeDetector,
      isFireHydrant,
      notes,
    } = this.state;

    const {navigation, route} = this.props;
    const {recid} = route.params;

    let data = qs.stringify({
      Name: name,
      'Address-Line1': address1,
      'Address-Line2': address2,
      'Address-City': city,
      'Address-State': state,
      'Address-Zip': zip,
      'Address-Country': country,
      StartDate: boughtOn,
      HouseSize: houseSize,
      LotSize: lotSize,
      County: county,
      SchoolDistrict: schoolDistrict,
      APN: apn,
      PropertyTaxAmount: propertyTaxAmnt,
      YearOfConstruction: yearOfConstruction,
      Age: age,
      NumberOfLevels: numberOfLevels,
      GarageSize: garageSize,
      RespondingFireDepartment: respondingFireDepartment,
      DistanceToNearestFireDepartment: distanceToFireDepartment,
      EndDate: soldOn,
      PropertyType: purpose,
      ResidenceType: residenceType,
      ConstructionType: constructionType,
      GarageType: garageType,
      SprinklerType: sprinklerType,
      FireAlarmType: fireAlarmType,
      BurglarAlarmType: burgularAlarmType,
      HasSmokeDetectors: smokeDetector === 'Yes' ? true : false,
      IsFireHydrantWithinThousandFeet: isFireHydrant === 'Yes' ? true : false,
      Notes: notes,
    });

    await createOrUpdateRecord('Property', recid, data, access_token)
      .then((response) => {
        this.setState({isLoader: false});
        navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoader: false});
      });
  };

  delete = async () => {
    const {navigation, route} = this.props;
    const {recid} = route.params;
    await deleteRecords(
      'Property',
      recid,
      this.props.userData.userData.access_token,
    )
      .then((response) => navigation.goBack())
      .catch((error) => console.log('Error in delete', error));
  };

  archive = async () => {
    this.setState({isLoader: true});
    const {navigation, route} = this.props;
    const {recid} = route.params;
    let data = qs.stringify({
      IsArchived: true,
    });
    await archiveRecords(
      'Property',
      recid,
      this.props.userData.userData.access_token,
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
      });
  };

  additionalInformation = () => (
    <View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <ModalPicker
            label={
              this.state.sprinklerType.length === 0
                ? 'Sprinkler Type'
                : this.state.sprinklerType
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: sprinkler_type,
                  key: 'sprinklerType',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Sprinkler Type"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={
              this.state.fireAlarmType.length === 0
                ? 'Fire Alarm Type'
                : this.state.fireAlarmType
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: alarm_type,
                  key: 'fireAlarmType',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Fire Alarm Type"
          />
        </View>
      </View>
      <View style={styles.miniContainer}>
        <View style={[styles.miniInputContainer, {marginRight: 10}]}>
          <ModalPicker
            label={
              this.state.burgularAlarmType.length === 0
                ? 'Burglar Alarm Type'
                : this.state.burgularAlarmType
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: alarm_type,
                  key: 'burgularAlarmType',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Burglar Alarm Type"
          />
        </View>
        <View style={styles.miniInputContainer}>
          <ModalPicker
            label={
              this.state.smokeDetector.length === 0
                ? 'Smoke Detectors'
                : this.state.smokeDetector
            }
            onPress={() =>
              this.setState(
                {
                  modal: true,
                  array: boolean_value,
                  key: 'smokeDetector',
                },
                () => this.changesMade(),
              )
            }
            color={Color.veryLightBlue}
            editable={this.state.editable}
            name="Smoke Detectors"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Responding Fire Department"
          onChangeText={(respondingFireDepartment) =>
            this.setState({respondingFireDepartment}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.respondingFireDepartment}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Distance To Fire Department"
          onChangeText={(distanceToFireDepartment) =>
            this.setState({distanceToFireDepartment}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.distanceToFireDepartment}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.isFireHydrant.length === 0
              ? 'Is the Fire Hydrant Within 1000 Feet?'
              : this.state.isFireHydrant
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: boolean_value,
                key: 'isFireHydrant',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Is the Fire Hydrant Within 1000 Feet?"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Sold On"
          onChangeText={(soldOn) =>
            this.setState({soldOn: formatDate(soldOn)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.soldOn}
          editable={this.state.editable}
          example="DD/MM/YYYY"
        />
      </View>
    </View>
  );

  basicInformation = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Name"
          onChangeText={(name) =>
            this.setState({name}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.name}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.purpose.length === 0 ? 'Purpose' : this.state.purpose
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: purpose,
                key: 'purpose',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Purpose"
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.residenceType.length === 0
              ? 'Residance Type'
              : this.state.residenceType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: residence_type,
                key: 'residenceType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Residance Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Address Line 1"
          onChangeText={(address1) =>
            this.setState({address1}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
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
          color={Color.paleRed}
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
          color={Color.paleRed}
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
          color={Color.paleRed}
          value={this.state.state}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Zip/Postal"
          onChangeText={(zip) => this.setState({zip}, () => this.changesMade())}
          keyboardType="default"
          color={Color.paleRed}
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
            this.setState(
              {
                modal: true,
                array: this.props.country.country,
                key: 'country',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Country"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Bought On"
          onChangeText={(boughtOn) =>
            this.setState({boughtOn: formatDate(boughtOn)}, () =>
              this.changesMade(),
            )
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.boughtOn}
          editable={this.state.editable}
          example="DD/MM/YYYY"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="House Size"
          onChangeText={(houseSize) =>
            this.setState({houseSize}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.houseSize}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Lot Size"
          onChangeText={(lotSize) =>
            this.setState({lotSize}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.lotSize}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="County"
          onChangeText={(county) =>
            this.setState({county}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.county}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="School District"
          onChangeText={(schoolDistrict) =>
            this.setState({schoolDistrict}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.schoolDistrict}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="APN #"
          onChangeText={(apn) => this.setState({apn}, () => this.changesMade())}
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.apn}
          editable={this.state.editable}
        />
      </View>
    </View>
  );

  propertyDetails = () => (
    <View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Property Tax Amount"
          onChangeText={(propertyTaxAmnt) =>
            this.setState({propertyTaxAmnt}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.propertyTaxAmnt}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Year of Construction"
          onChangeText={(yearOfConstruction) =>
            this.setState({yearOfConstruction}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.yearOfConstruction}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Age"
          onChangeText={(age) => this.setState({age}, () => this.changesMade())}
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.age}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Number of Levels"
          onChangeText={(numberOfLevels) =>
            this.setState({numberOfLevels}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.numberOfLevels}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.constructionType.length === 0
              ? 'Construction Type'
              : this.state.constructionType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: construction_type,
                key: 'constructionType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Construction Type"
        />
      </View>
      <View style={styles.inputContainer}>
        <InputTextDynamic
          placeholder="Garage Size"
          onChangeText={(garageSize) =>
            this.setState({garageSize}, () => this.changesMade())
          }
          keyboardType="default"
          color={Color.paleRed}
          value={this.state.garageSize}
          editable={this.state.editable}
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalPicker
          label={
            this.state.garageType.length === 0
              ? 'Garage Type'
              : this.state.garageType
          }
          onPress={() =>
            this.setState(
              {
                modal: true,
                array: garage_type,
                key: 'garageType',
              },
              () => this.changesMade(),
            )
          }
          color={Color.veryLightBlue}
          editable={this.state.editable}
          name="Garage Type"
        />
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
          color={Color.veryLightBlue}
            value={this.state.notes}
          />
        ) : (
          <Text style={styles.notes}>{this.state.notes}</Text>
        )}
      </View>
    </View>
  );

  changeModalVisibility = (bool) => {
    this.setState({modal: bool});
  };

  changeState = (key, value) => {
    this.setState({[key]: value});
  };

  changesMade = () => {
    const {mode} = this.props.route.params;
    const {editable} = this.state;
    if (!editable) this.setState({changes: true}, () => console.log('Check: '));
  };

  editComponent = (isLoader, modal, array, key) => (
    <View>
      <Text style={styles.title}>Basic Information</Text>
      {this.basicInformation()}
      <View style={styles.gap} />
      <Text style={styles.title}>Property Details</Text>
      {this.propertyDetails()}
      <View style={styles.gap} />
      <Text style={styles.title}>Additional Information</Text>
      {this.additionalInformation()}
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
    if (changes) {
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
    } else {
      navigation.goBack();
    }
    return true;
  };

  background = () =>
    require('../../../assets/jpg-images/Personal-Assets-Background/personal-assets-background.jpg');

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
              <SwitchKey type={'Property'} recid={recid} shareKeyId={shareKeyId} refresh={this.refreshData}/>
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

export default connect(mapStateToProps)(Property);
